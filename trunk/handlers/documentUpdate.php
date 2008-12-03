<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$isInit = isset($_GET['init']);

// Both '+' and '&' have to be put back in.  They were taken out for transmission.
$updateArray = json_decode(preg_replace('/pLUsSign/',"+", preg_replace('/aMPerSand/',"&",$_POST['updateData'])),true);

$lastDocID;
$masterFileHandle = null;

foreach ($updateArray as $updateObject){
	$dID = $updateObject["documentID"];
	$action = $updateObject["action"];
	$lineNum = $updateObject["lineNum"];
	$text = $updateObject["text"];
	$updateNumber = $updateObject["updateNum"];		// For ordering
	$lastUpdateID = $updateObject["lastUpdateNum"];	// For synchronization

	// Reset the counter on init (the page was either just loaded or refreshed)
	if( $isInit == true ){
		$_SESSION['docUpdateOrder'] = 0;
		$isInit = false;
	}
	// We need to set the counter back once we hit 99 so we can just keep looping.  The client only keeps track of 100 updates
	else if( $updateNumber == 99 ){
		$_SESSION['docUpdateOrder'] = -1;
	}
	// Something happened and updates got out of order.  Ask the client for all updates starting at the expected number
	else if( $_SESSION['docUpdateOrder']+1 != $updateNumber ){
		$nextUpdateNum = intval($_SESSION['docUpdateOrder'])+1;
		echo "missingUpdateError^split&".$nextUpdateNum;
		return;
	}
	else{
		$_SESSION['docUpdateOrder'] = $updateNumber;
	}

	// We haven't gotten the file handle yet - get it
	if($masterFileHandle == null){
		$masterFileHandle = getDocFileHandle($uID, $dID);
	}
	// In one batch, updates to multiple documents came (the user may have switched docs)
	// Save any changes we made to the last document handle we had, and then get a new file handle for the new document
	else if($lastDocID != $dID){
		$fileName = "../documents/doc".$lastDocID;
		file_put_contents($fileName, $masterFileHandle);
		flock($file, LOCK_UN); // release the lock
		$masterFileHandle = getDocFileHandle($uID, $dID);
	}
	
	doUpdate($uID, $dID, $masterFileHandle, $action, $lineNum, $text, $lastUpdateID);
	
	$lastDocID = $dID;
}


// After we are done updating, we have to write all the changes we made to disk
if($masterFileHandle != null){
	$fileName = "../documents/doc".$lastDocID;
	file_put_contents($fileName, $masterFileHandle);
	flock($file, LOCK_UN); // release the lock
}


// This function returns a handle to the physical document
// We will then pass around a reference so we don't have to keep opening and closing it
function getDocFileHandle($uID, $dID){

	// Check to make sure the user has write access to the document
	$checkSQL = "SELECT * FROM access WHERE dID='$dID' AND uID='$uID' AND accessLvl='w';";
	$checkResult = runQuery($checkSQL);
	if(mysql_num_rows($checkResult) < 1){		
		exit("You do not have permission to modify this document.");
	}
	
	$fileName = "../documents/doc".$dID;
	if(file_exists($fileName)){
		global $file;
		$file = @fopen("../documents/doclock/writeLock".$dID,"w");
		if (flock($file, LOCK_EX)){
			return file($fileName);
		}
		else{
			exit("Error getting file lock for master document.");
		}
	}
	else{
		exit("The document does not exist on the server.");
	}
}

function doUpdate($uID, $dID, &$docHandle, $action, $lineNum, $text, $lastUpdateID){

	if($uID == "" || $dID == "" || $action == "" || $lineNum === ""){
		return;
	}

	// Any pending updates for us need to be taken into account
	// If we have pending deletes, we should move our line num up
	// If we have pending inserts, we should move our line num down
	$fix_lines_query = "SELECT * FROM updates WHERE updates.changeByUser!='$uID' AND updates.updateID > $lastUpdateID AND updates.docID='$dID' AND updates.lineID<= $lineNum AND (updates.action='d' OR updates.action='i');";
	$lineQueryResult = runQuery($fix_lines_query);
	if(mysql_num_rows($lineQueryResult) > 0){
		while ($row = mysql_fetch_array($lineQueryResult))
		{
			if( $row['action'] == "i" ){				
				$lineNum++;				
			}
			else if( $row['action'] == "d" ){				
				$lineNum--;				
			}
		}
	}	
	
	// Inserts and deletes change the line locks.  Account for that.
	updateLineLocks($uID, $dID, $lineNum, $action);

	// Add our changes that need to be made to the database so other users can find out about them
	$insert_update_query = "INSERT INTO updates VALUES(null,'$dID','$uID','$lineNum','$action','".addslashes($text)."',CURRENT_TIMESTAMP);";
	$updateResult = runQuery($insert_update_query);
	$updateID = mysql_insert_id();

	// Now see if there are any other users working on the same document
	// If so, queue up the changes for them
	$active_user_query = "SELECT uID FROM access WHERE dID='$dID' AND uID!='$uID' AND (dLastActivity>DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 10 SECOND));";
	$activeResult = runQuery($active_user_query);
	if(mysql_num_rows($activeResult) > 0){
		while ($row = mysql_fetch_array($activeResult))
		{
			$update_queue_insert = "INSERT INTO updatequeue VALUES('$updateID','".$row['uID']."');";
			$updateQueueResult = runQuery($update_queue_insert);
		}
	}
	
	// Update the physical document
	$fileName = "../documents/doc".$dID;
	if($action == "u"){
		updateLine($fileName, $docHandle, $lineNum, $text);
	}
	else if($action == "i"){
		insertLine($fileName, $docHandle, $lineNum, $text);
	}
	else if($action == "d"){
		deleteLine($fileName, $docHandle, $lineNum);
	}
}

function updateLine($fileName, &$fileHandle, $lineNum, $lineText){
	if(count($fileHandle) < $lineNum){
		exit("Line '$lineNum' not found to update");
	}
	$fileHandle[$lineNum] = $lineText."\n";
}

function insertLine($fileName, &$fileHandle, $position, $lineText){
	if(count($fileHandle) < $position){
		exit("Line '$lineNum' not found to insert");
	}
	array_splice($fileHandle,$position,0,$lineText."\n");
}

function deleteLine($fileName, &$fileHandle, $lineNum){
	if(count($fileHandle) < $lineNum){
		exit("Line '$lineNum' not found to delete");
	}
	$beforeLine = array_slice($fileHandle, 0, $lineNum);
	$afterLine = array_slice($fileHandle, $lineNum + 1);
	$fileHandle = array_merge($beforeLine, $afterLine);
}

function updateLineLocks($uID, $dID, $curLine, $action){
	if($uID == "" || $dID == "" || $curLine === ""){
		return;
	}
	
	// We only need to update the line locks if it was an insert or a delete
	if($action != "i" && $action != "d"){
		return;
	}

	$fileName = "../documents/lineLock/doc".$dID."-lock";
	$toWriteBack = "";
	if(file_exists($fileName)){		
		$fileHandle = fopen($fileName, 'r') or die("can't open file");
		$wholeFile = fread($fileHandle, filesize($fileName)+1);
		fclose($fileHandle);

		$lineArray = explode("\n", $wholeFile);
		foreach($lineArray as $line){
			$lineParts = explode(",", $line);
			if($lineParts[0] == $uID){
				$toWriteBack .= $line . "\n";
				continue;
			}
			$sqlCheckStillActive = "SELECT * FROM access WHERE dID='$dID' AND uID='$lineParts[0]' AND (dLastActivity>DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 10 SECOND));";
			$result = runQuery($sqlCheckStillActive);
			if(mysql_num_rows($result) > 0){
				if($action == "i" && $lineParts[1] >= $curLine){
					$newLineNum = intval($lineParts[1])+1;
					$toWriteBack .= $lineParts[0] . "," . $newLineNum . "," . $lineParts[2] . "\n";
				}
				else if($action == "d" && $lineParts[1] > $curLine){
					$newLineNum = intval($lineParts[1])-1;
					$toWriteBack .= $lineParts[0] . "," . $newLineNum . "," . $lineParts[2] . "\n";
				}
				else if($action == "d" && $lineParts[1] == $curLine){
					// A user can't delete the line you are on!!!
					// What do we do about it here?
				}
				else{
					$toWriteBack .= $line . "\n";
				}
			}
		}
	}
	else{
		return;  // The line lock file doesn't exist...  We will check on the next run for it.
	}

	$fileHandle = fopen($fileName, 'w') or die("can't open file");
	fwrite($fileHandle, $toWriteBack);
	fclose($fileHandle);
}

?>