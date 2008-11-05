<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$color = $_GET['color'];

if($uID == "" || $color == ""){
	return;
}

$_SESSION['uColor'] = $color;

$updateColorSQL = "UPDATE users SET uColor='$color' WHERE uID='$uID';";
runQuery($updateColorSQL);

?>