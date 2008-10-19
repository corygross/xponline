<?php
	require_once 'dbConnect.php';
	
	//Where on the server are we going to store these files?
	$filePath = "uploads/";
	$filePath = $filePath.basename($_FILES['filename']['name']);

	//How will this be set? Presumably this could be counter variable
	//that is incremented as each file is uploaded
	$fileID = 09;
	$filename = $_FILES['filename']['name'];
	
	//Grab the selected file 
	//Uncomment this if we want to see what file we are uploading
	//$filename = $_FILES['filename']['name'];

	if(($validCheck = securityCheck($filename)))
	{
		//move the uploaded file to the directory of choice
		move_uploaded_file($_FILES['filename']['tmp_name'], $filePath);

		//Insert relevant information in the database
		$insertStmt = "INSERT INTO `xponline`.`documents` (`dID`, `dName`, `dLocation`) VALUES ('$fileID', '$filename', '$filePath');";
		$con = runquery($insertStmt);
	}
	

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
