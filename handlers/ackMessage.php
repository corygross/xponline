<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$mID = $_GET['mID'];

if($uID == "" || $mID == ""){
	return;
}

$delSQL = "DELETE from msgqueue WHERE mID='$mID' AND toID='$uID';";
runQuery($delSQL);

?>