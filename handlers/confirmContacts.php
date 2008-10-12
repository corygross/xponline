<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$usersToConfirm = $_GET['usersToConfirm'];

if($uID == "" || $usersToConfirm == ""){
	return;
}
$userArr = split(",", $usersToConfirm);

//iterate array here
foreach($userArr as $user){
	if($user == ""){
		continue;
	}
	$confirmSQL = "UPDATE contacts SET u1Accept=1, u2Accept=1 WHERE ((uID1 = $uID AND uID2 = $user) OR (uID2 = $uID AND uID1 = $user))";
	$reqResult = runQuery($confirmSQL);
}
