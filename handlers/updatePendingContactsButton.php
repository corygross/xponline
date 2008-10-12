<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];

if($uID == ""){
	echo "Please log in.";
	return;
}

$requestsSQL = "SELECT * FROM contacts WHERE (uID1 = $uID AND u1Accept = 0) OR (uID2 = $uID AND u2Accept = 0);";
$reqResult = runQuery($requestsSQL);
$num = mysql_num_rows($reqResult);
if($num > 0){
echo "<div class='messenger_button' onClick=\"openPopup('confirmContact','Confirm contact request','confirmContact');getPendingContacts();\">";
if($num == 1){
	echo "1 contact request";
}
else if($num > 1){
	echo $num . " contact requests";
}
echo "</div>";
}
?>