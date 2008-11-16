<?php
session_start();
//require_once "../dbConnect.php";
require_once $_SESSION['homeDir']."\dbConnect.php";

$currentUserID = "";

if(isset($_SESSION['uID'])) { $currentUserID = $_SESSION['uID']; }

if($currentUserID == ""){
	echo "fail";
	return;
}

$sqlGetOnlineContacts = "SELECT * FROM contacts,users WHERE ((uID1='$currentUserID' AND uID2=uID ) OR (uID2='$currentUserID' AND uID1=uID)) AND (u1accept='1' AND u2accept='1') AND uLastActivity>=DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 15 SECOND) ORDER BY users.uFName ASC, users.uLName ASC;";
$onlineResults = runQuery($sqlGetOnlineContacts);

//echo count($onlineResults);
//echo $onlineResults;

while ($row = mysql_fetch_array($onlineResults))
{	

	$cID = $row['uID'];
	//echo $cID;
	$cName = $row['uFName']." ".$row['uLName'];
//	echo "online";
	echo "<li id=\"contactItem$cID\" class=\"contact\" onClick=\"openChat('$cID', '$cName');\">$cName</li>";
}

?>