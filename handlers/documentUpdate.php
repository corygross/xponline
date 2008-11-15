<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$updateArray = json_decode($_POST['updateData'],true);
//$decoded = json_decode($_POST['updateData'],true);
//echo $decoded[0]["action"];

//echo $updateArray[0]["action"];

$lastDocID;
$lastAction;
$lastLineNum;

foreach ($updateArray as $updateObject){
	$dID = $updateObject["documentID"];
	$action = $updateObject["action"];
	$lineNum = $updateObject["lineNum"];
	$text = $updateObject["text"];
	
	// This will ignore continuous updates to the same line, taking only the last (most current) one
	//if(!($action == "u" && $lastAction == "u" && $lastLineNum == $lineNum && $lastDocID == $dID)){
		doUpdate($uID, $dID, $action, $lineNum, $text);
	//}
	
	$lastDocID = $dID;
	$lastAction = $action;
	$lastLineNum = $lineNum;
	
	//echo $updateObject["text"];
	//doUpdate($uID, $updateObject["documentID"], $updateObject["action"], $updateObject["lineNum"], $updateObject["text"]);
}

/*
$dID = $_GET['docID'];

// The action is whether it is an update, insert, or delete
$action = $_GET['action'];

// The text is what text we want to change our line to
$text = $_GET['text'];

// The ID of the line we want to manipulate
$lineNum = $_GET['lNum'];
*/

function doUpdate($uID, $dID, $action, $lineNum, $text){

	if($uID == "" || $dID == "" || $action == "" || $lineNum == ""){
		return;
	}


	// Check to make sure the user has write access to the document
	$checkSQL = "SELECT * FROM access WHERE dID='$dID' AND uID='$uID' AND accessLvl='w';";
	$checkResult = runQuery($checkSQL);
	if(mysql_num_rows($checkResult) < 1){
		echo "You don't have permission to modify this document.";
		return;
	}

	// TODO: see if anything needs to be done beforehand - anything that might conflict or change line numbers
	
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
	if(file_exists($fileName)){
		if($action == "u"){
			updateLine($fileName, $lineNum, $text);
		}
		else if($action == "i"){
			insertLine($fileName, $lineNum, $text);
		}
		else if($action == "d"){
			deleteLine($fileName, $lineNum);
		}
	}

}

function updateLine($fileName, $lineNum, $lineText){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $lineNum){
		echo "line not found";
		return;
	}
	$fileHandle[$lineNum] = $lineText."\n";
	file_put_contents($fileName, $fileHandle);
}

function insertLine($fileName, $position, $lineText){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $position){
		echo "line not found";
		return;
	}
	array_splice($fileHandle,$position,0,$lineText."\n");
	file_put_contents($fileName, $fileHandle);
}

function deleteLine($fileName, $lineNum){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $lineNum){
		echo "line not found";
		return;
	}
	$beforeLine = array_slice($fileHandle, 0, $lineNum);
	$afterLine = array_slice($fileHandle, $lineNum + 1);
	$fileHandle = array_merge($beforeLine, $afterLine);
	file_put_contents($fileName, $fileHandle);
}

function updateLineLocks($uID, $dID, $curLine, $action){
	if($uID == "" || $dID == "" || $curLine == ""){
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
			$sqlCheckStillActive = "SELECT * FROM access WHERE dID='$dID' AND uID='$lineParts[0]' AND (dLastActivity>DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 30 SECOND));";
			$result = runQuery($sqlCheckStillActive);
			if(mysql_num_rows($result) > 0){
				if($action == "i" && $lineParts[1] > $curLine){
					$newLineNum = intval($lineParts[1])+1;
					$toWriteBack .= $lineParts[0] . "," . $newLineNum . "," . $lineParts[2] . "\n";
				}
				else if($action == "d" && $lineParts[1] > $curLine){
					$newLineNum = intval($lineParts[1])-1;
					$toWriteBack .= $lineParts[0] . "," . $newLineNum . "," . $lineParts[2] . "\n";
				}
				else{
					$toWriteBack .= $line . "\n";
				}
			}
		}
	}
	else{
		echo "file not found";
	}

	$fileHandle = fopen($fileName, 'w') or die("can't open file");
	fwrite($fileHandle, $toWriteBack);
	fclose($fileHandle);
}

?>