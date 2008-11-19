<?php
session_start();
require_once "dbConnect.php";

//Validate login
$currentUserID = $_SESSION['uID'];
if($currentUserID == ""){
	echo "User not logged in."; 
	return;
}

$currentDocumentID = $_GET['dID'];
if($currentDocumentID == "undefined"){
	$currentDocumentID = "";
}

//UPDATE when the last connection was made
$sqlUpdateTime = "UPDATE users SET uLastActivity=CURRENT_TIMESTAMP WHERE uID='$currentUserID';";
runQuery($sqlUpdateTime);

//UPDATE when the last time the user was connected and working on a particular document
if($currentDocumentID != ""){
	$sqlUpdateDocTime = "UPDATE access SET dLastActivity=CURRENT_TIMESTAMP WHERE dID='$currentDocumentID' AND uID='$currentUserID';";
	runQuery($sqlUpdateDocTime);
}

if (ob_get_level() == 0) ob_start();

/*
 * Retrieves a message from the message queue
 *
 * 
 *
 *
 */
function getMessage($currentUserID)
{
	$output_query = "SELECT * FROM msgqueue,users WHERE msgqueue.toID = '$currentUserID' AND (msgqueue.delivTryTime IS NULL OR msgqueue.delivTryTime<DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 5 SECOND)) AND msgqueue.fromID=users.uID ORDER BY msgqueue.mID ASC;";
	$resultSet = runQuery($output_query);
	
	$xmlToSend = "";

	while ($row = mysql_fetch_array($resultSet))
	{
		$xmlToSend .= "<newMsg>";
		$xmlToSend .= "<fromID>".$row['fromID']."</fromID>";
		$xmlToSend .= "<uFName><![CDATA[".$row['uFName']."]]></uFName>";
		$xmlToSend .= "<uLName><![CDATA[".$row['uLName']."]]></uLName>";
		$xmlToSend .= "<msg><![CDATA[".stripslashes($row['msg'])."]]></msg>";
		$xmlToSend .= "<mID>".$row['mID']."</mID>";
		$xmlToSend .= "</newMsg>";
		
		$mID = $row['mID'];

		//Update the attempted send time
		$updateSQL = "UPDATE msgqueue SET delivTryTime=CURRENT_TIMESTAMP WHERE mID='$mID';";
		runQuery($updateSQL);	
	}
	
	if($xmlToSend != ""){
		return "<chat>" . $xmlToSend . "</chat>";
	}
	else{
		return "";
	}
}

function getCollisionInfo($uID, $dID){
	if($dID == ""){
		return "";
	}
	
	$fileName = "./documents/lineLock/doc".$dID."-lock";
	if(file_exists($fileName)){
		$fileModifyTime = filemtime($fileName);
		$lastModifyKey = 'lastLockFileModify'.$dID;
		if($fileModifyTime != $_SESSION["$lastModifyKey"] || $_SESSION['newFileInit'] == "true"){
			$_SESSION['newFileInit'] = "false";
			$_SESSION["$lastModifyKey"] = $fileModifyTime;
			
			$fileHandle = fopen($fileName, 'r') or die("can't open file");
			//$wholeFile = fread($fileHandle, filesize($fileName)+1);
			$wholeFile = fread($fileHandle, filesize($fileName));
			fclose($fileHandle);

			$locksToReturn = "";
			$lineArray = explode("\n", $wholeFile);
			foreach($lineArray as $line){
				if($line == ""){
					continue;
				}
				$lockInfo = explode(",", $line);
				if($lockInfo[0] != $uID){
					$locksToReturn .= "<lineLock><userID>$lockInfo[0]</userID><lineNum>$lockInfo[1]</lineNum><userName><![CDATA[".$lockInfo[2]."]]></userName></lineLock>";
				}
			}
			if($locksToReturn != ""){
				return "<locks>".$locksToReturn."</locks>";
			}
		}		
	}
	return "";
}

function getPeerUpdates($uID, $dID){
	if($dID == ""){
		return "";
	}
	
	$fileName = "./documents/doc".$dID;
	if(file_exists($fileName)){
		$fileModifyTime = filemtime($fileName);
		$lastModifyKey = 'lastMasterFileModify'.$dID;
		$checkedAgainKey = 'checkedModifyAgain'.$dID;
		
		// We need to check again a second time... because if we don't an update might get stuck in the database until the user makes another change
		$checkForUpdates = false;
		if($fileModifyTime != $_SESSION["$lastModifyKey"]){
			$_SESSION["$lastModifyKey"] = $fileModifyTime;
			$_SESSION["$checkedAgainKey"] = $fileModifyTime + 2;
			$checkForUpdates = true;
		}
		else if($_SESSION["$checkedAgainKey"] != "false" && $_SESSION["$checkedAgainKey"] <= $fileModifyTime){
			$_SESSION["$checkedAgainKey"] = "false";
			$checkForUpdates = true;
		}
		
		if($checkForUpdates == true){
			$updateXML = "";
			$pending_updates = "SELECT * FROM updatequeue, updates WHERE updatequeue.userID='$uID' AND updatequeue.updateID=updates.updateID AND updates.docID='$dID' ORDER BY updates.updateID ASC;";
			$pendingResult = runQuery($pending_updates);
			if(mysql_num_rows($pendingResult) > 0){
				while ($row = mysql_fetch_array($pendingResult))
				{
					$updateXML .= "<docUpdate><updateID>".$row['updateID']."</updateID><action>".$row['action']."</action><line>".$row['lineID']."</line><text><![CDATA[".$row['text']."]]></text></docUpdate>";
					// Should this be done with an ACK?
					$clear_update = "DELETE FROM updatequeue WHERE userID='$uID' AND updateID='".$row['updateID']."';";
					$clearResult = runQuery($clear_update);
				}
			}
			if($updateXML != ""){
				return "<docUpdates>".$updateXML."</docUpdates>";
			}
		}		
	}
	return "";
}

// Update the pending contacts button every $interval seconds (approx)
function updatePendingContactsButton($interval){
	if( isset($_SESSION['updateContactButtonTime']) == false || $_SESSION['updateContactButtonTime'] < time() || $_GET['init'] == "true" ){
		$_SESSION['updateContactButtonTime'] = time() + $interval;
	}
	else{
		return "";
	}
	require_once "handlers/updatePendingContactsButton.php";
	$button = getButton();
	
	// The button HTML must be enclosed by the CDATA tag, otherwise the HTML will be chopped up by the XML parser
	return "<pendingButton><![CDATA[".$button."]]></pendingButton>";
}

// Update the contact list every $interval seconds (approx)
function updateContactList($interval){
	$returnImmediately = false;
	if( isset($_SESSION['updateContactListTime']) == false || $_GET['init'] == "true" ){
		$_SESSION['updateContactListTime'] = time() + $interval;
		$returnImmediately = true;
	}
	else if( $_SESSION['updateContactListTime'] < time() ){
		$_SESSION['updateContactListTime'] = time() + $interval;
	}
	else{
		return false;
	}
	// The button HTML must be enclosed by the CDATA tag, otherwise the HTML will be chopped up by the XML parser
	echo "<contactList><![CDATA[";
	require_once "handlers/updateContactList.php";
	echo "]]></contactList>";
	return $returnImmediately;
}

// Loop for awhile... waiting for something interesting to happen...
for ($i = 0; $i<100; $i++) 
{ 	
	// Get the message to send (if any)
	$messageToSend = getMessage($currentUserID);
	
	// Get information about where another user is located in the current document
	$collisionInfo = getCollisionInfo($currentUserID, $currentDocumentID);
	
	// Get any changes that our peers have made to the current document
	$peerUpdates = getPeerUpdates($currentUserID, $currentDocumentID);
	
	// Update the pending contacts button every 30 seconds
	$pendingContactsUpdate = updatePendingContactsButton(30);
	
	// Update the contact list
	$isDataToSend = updateContactList(15);
	
	//$isDataToSend = false;
	
	if ($messageToSend != ""){
		$isDataToSend = true;
		echo $messageToSend;		
	}
	
	if ($collisionInfo != ""){
		$isDataToSend = true;
		echo $collisionInfo;		
	}
	
	if ($peerUpdates != ""){
		$isDataToSend = true;
		echo $peerUpdates;		
	}
	
	if ($pendingContactsUpdate != ""){
		$isDataToSend = true;
		echo $pendingContactsUpdate;		
	}
	
	if($isDataToSend == true){
		echo "</body>"; //This is key to have this here, at least for Safari
		ob_flush();
		flush();		
		
		ob_end_flush(); //necessary
		break;
	}

	usleep(50000);
	//usleep(100000);
}

?>