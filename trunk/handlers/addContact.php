<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$userToAdd = $_GET['userToAdd'];

if($uID == "" || $userToAdd == ""){
	echo "fail";
	return;
}

$addSQL = "INSERT INTO contacts VALUES ('$uID','$userToAdd','1','0')";
$response = runQuery($addSQL);

if(!response){
	echo "fail";
	return;
}

echo "success";
?>