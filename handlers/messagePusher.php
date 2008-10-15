<?php
session_start();
require_once "../dbConnect.php";

$currentUserID = $_SESSION['uID'];

//UPDATE when the last connection was made
$sqlUpdateTime = "UPDATE users SET uLastActivity=CURRENT_TIMESTAMP WHERE uID='$currentUserID';";
runQuery($sqlUpdateTime);

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
	$output_query = "SELECT * FROM msgqueue,users WHERE msgqueue.toID = '$currentUserID' AND (msgqueue.delivTryTime IS NULL OR msgqueue.delivTryTime<DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 5 SECOND)) AND msgqueue.fromID=users.uID ORDER BY sentTime ASC;";
	$resultSet = runQuery($output_query);

	while ($row = mysql_fetch_array($resultSet))
	{	
		echo $row['fromID']."&^*".$row['uFName']." ".$row['uLName']."&^*".$row['msg']."&^*".$row['mID']."&^*";
		$mID = $row['mID'];
		
		//Update the attempted send time
		$updateSQL = "UPDATE msgqueue SET delivTryTime=CURRENT_TIMESTAMP WHERE mID='$mID';";
		runQuery($updateSQL);
		
	 	//echo str_pad('',4096)."\n";  //Safari need xx characters to first recognize pushed content.
		//echo "</body>"; //This is key to have this here, at least for Safari
		ob_flush();
	    flush();
		//Wait a second
	   	//usleep(10000000);		
	}
	//ob_flush();
	//flush();
	usleep(100000);
}

//Check for messages, and if found, send to client
for ($i = 0; $i<10; $i++) { getMessage($currentUserID); }

ob_end_flush(); //necessary

?>