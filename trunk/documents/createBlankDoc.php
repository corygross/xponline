<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$docName = $_GET['docName'];

if($uID == ""){
	echo "Please log in.";
	return;
}

if($docName == ""){
	echo "Please enter a name for your new document.";
	return;
}

//put the document info in the database
$sql = "INSERT INTO documents VALUES(null, '$docName', 'documents')";
$response = runQuery($sql);

if(!response){
	echo "There was an unknown error.  Please try again.";
	return;
}
//The newly created document ID
$newID = mysql_insert_id();

//give the creating user write access
$sql = "INSERT INTO access VALUES('$newID', '$uID', 'w', CURRENT_TIMESTAMP);";
$response = runQuery($sql);

//make a blank, empty document on the filesystem
$docNameOnFileSystem = "doc" . $newID;
$ourFileHandle = fopen($docNameOnFileSystem, 'w') or die("Can't create file");
fclose($ourFileHandle);

echo "success^5&".$newID."^5&".$docName;
?>