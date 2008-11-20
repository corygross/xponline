<?php
session_start();
require_once "../dbConnect.php";

/*
 * Function: fileDownload
 *
 * Purpose: Constructs a link that allows a user to download
 * 			the currently active file
 *
 * Parameters: docID - the document id of the active file
 *
 * Returns: None
 *
 *
 *
 */

$uID = addslashes($_SESSION['uID']);
$dID = addslashes($_GET['dID']);


// Look for only documents that we have access (read or write) to
$docNameSQL = "SELECT documents.* FROM access,documents WHERE access.dID='$dID' AND access.uID='$uID' AND access.dID=documents.dID AND documents.dID='$dID';";
$docResult = runQuery($docNameSQL);

$documentName = "";
if(mysql_num_rows($docResult) > 0){
	$row = mysql_fetch_array($docResult);
	$documentName = $row['dName'];
}
else{
	echo "Document not found or access error.";
	return;
}


$file = "../documents/doc".$dID;
if(file_exists($file) == false){
	echo "Document not found.";
	return;
}

// Send headers and the file contents
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename='.$documentName);
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Pragma: public');
header('Content-Length: ' . filesize($file));
ob_clean();
flush();
readfile($file);
exit;

?>