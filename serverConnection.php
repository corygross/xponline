<?php
session_start();
require_once "dbConnect.php";

//$browser = getBrowser();

//Validate login
$currentUserID = $_SESSION['uID'];
//if($currentUserID == ''){echo 'error 003: User not logged in.'; return;}

$currentDocumentID = $_GET['dID'];
//$currentDocumentID = $_SESSION['dID'];

//UPDATE when the last connection was made
$sqlUpdateTime = "UPDATE users SET uLastActivity=CURRENT_TIMESTAMP WHERE uID='$currentUserID';";
runQuery($sqlUpdateTime);

//UPDATE when the last time the user was connected and working on a particular document
if($currentDocumentID != ""){
	$sqlUpdateDocTime = "UPDATE access SET dLastActivity=CURRENT_TIMESTAMP WHERE dID='$currentDocumentID' AND uID='$currentUserID';";
	runQuery($sqlUpdateDocTime);
}

if (ob_get_level() == 0) ob_start();

function getBrowser()
{
	$browserInfo = strtolower($_SERVER['HTTP_USER_AGENT']);
	//echo $browserInfo;
	if( strstr($browserInfo, "firefox") != "" ){
		return "firefox";
	}
	else if( strstr($browserInfo, "msie") != "" ){
		return "ie";
	}
	else if( strstr($browserInfo, "chrome") != "" ){
		return "chrome";
	}
	else if( strstr($browserInfo, "safari") != "" ){
		return "safari";
	}
	return "";
}

/*
 * Check for a message on the server
 *
 *
 *
 */
function checkMessage()
{
	$output_query = "SELECT * FROM msgqueue,users WHERE msgqueue.toID = '$currentUserID' AND (msgqueue.delivTryTime IS NULL OR msgqueue.delivTryTime<DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 5 SECOND)) AND msgqueue.fromID=users.uID ORDER BY sentTime ASC;";
	$resultSet = runQuery($output_query);
	$row = null;
	$row = mysql_fetch_array($resultSet);
	return $row;
//	if(($row = mysql_fetch_array($resultSet)) != null){return $row;} return "";
}

/*
 * Send a message 
 * 
 *
 *
 */
function sendMessage($row)
{
		echo $row['fromID']."&^*".$row['uFName']." ".$row['uLName']."&^*".$row['msg']."&^*".$row['mID']."&^*";
		$mID = $row['mID'];
		//echo "</body>"; //This is key to have this here, at least for Safari
		//Update the attempted send time
		$updateSQL = "UPDATE msgqueue SET delivTryTime=CURRENT_TIMESTAMP WHERE mID='$mID';";
		runQuery($updateSQL);
	
		ob_flush();
	    flush();
	
}

function updateCheckTime($row)
{
//	echo "here update time";
	$mID = $row['mID'];
	//Update the attempted send time
	$updateSQL = "UPDATE msgqueue SET delivTryTime=CURRENT_TIMESTAMP WHERE mID='$mID';";
	runQuery($updateSQL);
	
}

/*
 * Retrieves a message from the message queue
 *
 * 
 *
 *
 */
function getMessage($currentUserID)
{
	$output_query = "SELECT * FROM msgqueue,users WHERE msgqueue.toID = '$currentUserID' AND (msgqueue.delivTryTime IS NULL OR msgqueue.delivTryTime<DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 5 SECOND)) AND msgqueue.fromID=users.uID ORDER BY sentTime ASC;";
	$resultSet = runQuery($output_query);
	
	$xmlToSend = "";

	while ($row = mysql_fetch_array($resultSet))
	{
		$xmlToSend .= "<newMsg>";
 		//echo str_pad('',4096)."\n";  //Safari need xx characters to first recognize pushed content.
		//echo $row['fromID']."&^*".$row['uFName']." ".$row['uLName']."&^*".$row['msg']."&^*".$row['mID']."&^*";
		$xmlToSend .= "<fromID>".$row['fromID']."</fromID>";
		$xmlToSend .= "<uFName>".$row['uFName']."</uFName>";
		$xmlToSend .= "<uLName>".$row['uLName']."</uLName>";
		$xmlToSend .= "<msg>".$row['msg']."</msg>";
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
		if($fileModifyTime != $_SESSION["$lastModifyKey"]){
			$_SESSION["$lastModifyKey"] = $fileModifyTime;
			
			$fileHandle = fopen($fileName, 'r') or die("can't open file");
			//$wholeFile = fread($fileHandle, filesize($fileName)+1);
			$wholeFile = fread($fileHandle, filesize($fileName));
			fclose($fileHandle);

			$locksToReturn = "";
			$lineArray = explode("\n", $wholeFile);
			foreach($lineArray as $line){		
				$pos = strpos($line, "$uID");
				if($pos === false || $pos != 0){
					$lockInfo = explode(",", $line);
					$locksToReturn .= "<lineLock><userID>$lockInfo[0]</userID><lineNum>$lockInfo[1]</lineNum><userName>$lockInfo[2]</userName></lineLock>";
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
		// not all updates are getting sent. the last one (if in rapid succession gets left in the db.) fix!
		//if($fileModifyTime != $_SESSION["$lastModifyKey"]){
		if($fileModifyTime != $_SESSION["$lastModifyKey"]){
			$_SESSION["$lastModifyKey"] = $fileModifyTime;
			$updateXML = "";
			$pending_updates = "SELECT * FROM updatequeue, updates WHERE updatequeue.userID='$uID' AND updatequeue.updateID=updates.updateID AND updates.docID='$dID' ORDER BY updateTime ASC;";
			$pendingResult = runQuery($pending_updates);
			if(mysql_num_rows($pendingResult) > 0){
				while ($row = mysql_fetch_array($pendingResult))
				{
					$updateXML .= "<docUpdate><updateID>".$row['updateID']."</updateID><action>".$row['action']."</action><line>".$row['lineID']."</line><text>".$row['text']."</text></docUpdate>";
					// Should this be done with an ACK?
					$clear_update = "DELETE FROM updatequeue WHERE userID='$uID' AND updateID='".$row['updateID']."';";
					$clearResult = runQuery($clear_update);
				}
			}
			if($updateXML != ""){
				return "<docUpdates>".$updateXML."<docUpdates>";
			}
		}		
	}
	return "";
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
	
	$isDataToSend = false;
	
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
	
	if($isDataToSend == true){
		echo "</body>"; //This is key to have this here, at least for Safari
		ob_flush();
		flush();
		
		// Take this out if trying to do interactive with firefox
		ob_end_flush(); //necessary
		break;
	}
	/*
	if($messageToSend != "" && $browser != "firefox"){
		ob_end_flush(); //necessary
		break;
	}
	*/
	usleep(50000);
	//usleep(100000);
}

//$message = checkMessage($currentUser);
//while(($message = checkMessage($currentUser) == null)
//{
//	updateCheckTime($message);
//	sleep(1);
//}
//sendMessage($message);
//updateCheckTime($message);

//ob_end_flush(); //necessary

?>