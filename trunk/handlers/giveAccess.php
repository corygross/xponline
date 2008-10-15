<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$user2 = $_GET['user'];
$dID = $_GET['docID'];
$aLevel = $_GET['aLvl'];

if($uID == ""){
	echo "Please log in.";
	return;
}

if($user2 == "" || $dID == "" || $aLevel == ""){
	echo "There was an error granting access to the user.";
	return;
}

//MAKE SURE that the current user has permission to grant access
$checkSQL = "SELECT * FROM access WHERE dID='$dID' AND uID='$uID' AND accessLvl='w';";
$checkResult = runQuery($checkSQL);
if(mysql_num_rows($checkResult) < 1){
	echo "You don't have permission to grant access to this document.";
	return;
}

//If 'none' was selected for access level, revoke access by clearing it from the database
if($aLevel == "n"){
	$delSQL = "DELETE FROM access WHERE dID='$dID' AND uID='$user2';";
	runQuery($delSQL);
	echo "success";
	return;
}

//First, see if the user already has some sort of access.
$existingSQL = "SELECT * FROM access WHERE dID='$dID' AND uID='$user2';";
$existingResult = runQuery($existingSQL);
if(mysql_num_rows($existingResult) < 1){
	//grant access
	$accessSQL = "INSERT INTO access VALUES('$dID','$user2','$aLevel');";
	$docsResult = runQuery($accessSQL);
}
else{
	//modify access
	$updateSQL = "UPDATE access SET accessLvl='$aLevel' WHERE dID='$dID' AND uID='$user2';";
	$updateResult = runQuery($updateSQL);
}

echo "success";
?>