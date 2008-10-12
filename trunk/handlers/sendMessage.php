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

//TODO: check here to make sure that the person we are trying to send a message to is a contact of ours.

$sql = "INSERT INTO msgqueue VALUES(null, '$uID', '$sendToID', '$message', CURRENT_TIMESTAMP)";
$response = runQuery($sql);

if(!response){
	echo "fail";
	return;
}

echo "success";
?>