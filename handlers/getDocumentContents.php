<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$dID = $_GET['dID'];

// Store the current document ID in a session so we can use it elsewhere
$_SESSION['dID'] = $dID;

if($uID == "" || $dID == ""){
	echo "fail";
	return;
}

//This checks permissions at the same time as it gets the document id and location.
$docSQL = "SELECT documents.*,access.accessLvl FROM documents,access WHERE documents.dID='$dID' AND documents.dID=access.dID AND access.uID='$uID';";
$response = runQuery($docSQL);
if(mysql_num_rows($response) < 1){
	echo "fail";
	return;
}

$row = mysql_fetch_array($response);
$accessLvl = $row['accessLvl'];
$myFile = "../".$row['dLocation']."/doc".$row['dID'];
$fh = fopen($myFile, 'r');
if(filesize($myFile) == 0){
	$theData = fgets($fh);
}
else{
	$theData = fread($fh, filesize($myFile));
}
fclose($fh);

$latestUpdateSQL = "SELECT MAX(updateID) FROM updates;";
$response = runQuery($latestUpdateSQL);
$latestUpdateNum = -1;

if(mysql_num_rows($response) > 0){
	$row = mysql_fetch_array($response);
	$latestUpdateNum = $row['MAX(updateID)'];
	if( $latestUpdateNum == "" ){
		$latestUpdateNum = -1;
	}
}

echo $accessLvl."&^*".$latestUpdateNum."&^*".$theData;

?>