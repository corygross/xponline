<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$sendToID = $_GET['sendToID'];
$message = $_GET['message'];

if($uID == "" || $sendToID == "" || $message == ""){
	echo "fail";
	return;
}

//Check here to make sure that the person we are trying to send a message to is a contact of ours.
$checkSQL = "SELECT * FROM contacts WHERE (uID1='$uID' AND uID2='$sendToID' AND u1accept='1' AND u2accept='1') OR (uID1='$sendToID' AND uID2='$uID' AND u1accept='1' AND u2accept='1');";
$checkResponse = runQuery($checkSQL);
if(!$checkResponse || mysql_num_rows($checkResponse) < 1){
	echo "fail";
	return;
}

//Put the message in the table to await delivery
$sql = "INSERT INTO msgqueue VALUES(null, '$uID', '$sendToID', '$message', CURRENT_TIMESTAMP, null);";
$response = runQuery($sql);

if(!response){
	echo "fail";
	return;
}

echo "success";
?>