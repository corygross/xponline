<?php
require_once 'dbConnect.php';

$uID = $_SESSION['uID'];

if($uID == ""){
	echo "fail";
	return;
}

//Where on the server are we going to store these files?
$filePath = "documents";

$filename = $_FILES['filename']['name'];

//Grab the selected file 
//Uncomment this if we want to see what file we are uploading
//$filename = $_FILES['filename']['name'];

if((securityCheck($filename) == false))
{
	return;
}

//Insert relevant information in the database
$insertStmt = "INSERT INTO `xponline`.`documents` (`dID`, `dName`, `dLocation`) VALUES (null, '$filename', '$filePath');";
$con = runQuery($insertStmt);

//The newly created document ID
$newID = mysql_insert_id();

//give the creating user write access
$sql = "INSERT INTO access VALUES('$newID', '$uID', 'w', CURRENT_TIMESTAMP);";
$response = runQuery($sql);

//make a blank, empty document on the filesystem
$docNameOnFileSystem = "$filePath/doc" . $newID;

//move the uploaded file to the directory of choice
move_uploaded_file($_FILES['filename']['tmp_name'], $docNameOnFileSystem);

echo "success^5&".$newID."^5&".$filename."^5&";	


/*
 *  Function: securityCheck
 * 
 *  Purpose: Some verification needs to 
 *	happen on the server, as well as the client
 *  to prevent the user from uploaded executables
 * 	or other maliciously crafted file to the server.
 *
 *  Other restrictions to be added later.
 *
 *
 */
function securityCheck($filename)
{
	//Check for obvious executable files (.exe, a.out, etc...)
	if(stristr($filename, ".exe")|| stristr($filename, "a.out"))
	{
		echo "Error, cannot upload file!";
		return false;
	}
	return true;
	
}
?>
