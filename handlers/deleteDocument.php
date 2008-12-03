<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$dID = $_GET['docID'];

if($uID == ""){
	echo "Please log in.";
	return;
}

if($dID == ""){
	echo "Please select a document to delete.";
	return;
}

// MAKE SURE that the current user has permission to delete the document
$checkSQL = "SELECT * FROM access WHERE dID='$dID' AND uID='$uID' AND accessLvl='w';";
$checkResult = runQuery($checkSQL);
if(mysql_num_rows($checkResult) < 1){
	echo "You don't have permission to delete this document.";
	return;
}

// Delete the physical document
$deleteFilePath = "../documents/doc".$dID;
if(file_exists($deleteFilePath)){	
	unlink($deleteFilePath);
}

// Delete the associated line lock file
$deleteLockFilePath = "../documents/lineLock/doc".$dID."-lock";
if(file_exists($deleteLockFilePath)){	
	unlink($deleteLockFilePath);
}

// Delete the file for write lock
$deleteWriteLockFilePath = "../documents/doclock/writeLock".$dID;
if(file_exists($deleteWriteLockFilePath)){	
	unlink($deleteWriteLockFilePath);
}

// Delete the document from the database
// Foreign keys are set to cascade deletes, so we don't have to mess with them
$deldocSQL = "DELETE FROM documents WHERE dID='$dID';";
runQuery($deldocSQL);

echo "success";
?>