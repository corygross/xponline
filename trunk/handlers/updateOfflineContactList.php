<?php
session_start();
require_once "../dbConnect.php";

$currentUserID = $_SESSION['uID'];

if($currentUserID == ""){
	echo "fail";
	return;
}

$sqlGetOnlineContacts = "SELECT * FROM contacts,users WHERE ((uID1='$currentUserID' AND uID2=uID ) OR (uID2='$currentUserID' AND uID1=uID)) AND (u1accept='1' AND u2accept='1') AND (uLastActivity<DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 15 SECOND)) ORDER BY users.uFName ASC, users.uLName ASC;";
$onlineResults = runQuery($sqlGetOnlineContacts);

while ($row = mysql_fetch_array($onlineResults))
{	
	$cID = $row['uID'];
	$cName = $row['uFName']." ".$row['uLName'];
	echo "<li id=\"contactItem$cID\" class=\"contact\" onClick=\"openChat('$cID', '$cName');\">$cName</li>";
}
?>