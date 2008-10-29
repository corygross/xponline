<?php
session_start();
require_once "dbConnect.php";

$browser = getBrowser();

//Validate login
$currentUserID = $_SESSION['uID'];
//if($currentUserID == ''){echo 'error 003: User not logged in.'; return;}

//UPDATE when the last connection was made
$sqlUpdateTime = "UPDATE users SET uLastActivity=CURRENT_TIMESTAMP WHERE uID='$currentUserID';";
runQuery($sqlUpdateTime);

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
	
	return $xmlToSend;
}

//echo "<chat>";
$messageToSend;
//Check for messages, and if found, send to client
for ($i = 0; $i<100; $i++) 
{ 	
	$messageToSend = getMessage($currentUserID);	
	
	if ($messageToSend != ""){
		echo "<chat>";
		echo $messageToSend;
		echo "</chat>";
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