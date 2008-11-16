<?php
session_start();

require_once $_SESSION['homeDir']."\dbConnect.php";

function getButton(){
	if(isset($_SESSION['uID'])) { $uID = $_SESSION['uID']; }

	if($uID == ""){
		return;
	}

	$requestsSQL = "SELECT * FROM contacts WHERE (uID1 = '$uID' AND u1Accept = 0) OR (uID2 = '$uID' AND u2Accept = 0);";
	$reqResult = runQuery($requestsSQL);
	$num = mysql_num_rows($reqResult);
	$stringToReturn = "";
	if($num > 0){
		$stringToReturn = "<div class='messenger_button' onClick=\"openPopup('confirmContact','Confirm contact request','confirmContact');getPendingContacts();\">";
		if($num == 1){
			$stringToReturn .= "1 contact request";
		}
		else if($num > 1){
			$stringToReturn .= $num . " contact requests";
		}
		$stringToReturn .= "</div>";
	}
	return $stringToReturn;
}
?>