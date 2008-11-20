<?php
	session_start();
	require_once 'dbConnect.php';
	
	//Some languages allow for multiple extensions for their source files, so allow for easy
	//changes
	//(ex. Objective-C uses .m or .mm)
	//$extensions = array("java" => array(".java"), "c" => array(".c") );
	$extensions = array("java" =>"javaflag", "c" => "cflag");
	
	//Ensure that the user is logged in 
	if(!isset($_SESSION['uID'])){ echo 'Error 001 - User not logged in'; return; }
	
	//Where on the server are we going to store these files?
	$filePath = "documents/";
	$filePath = $filePath.basename($_FILES['filename']['name']);

	//How will this be set? Presumably this could be counter variable
	//that is incremented as each file is uploaded
	$fileID = 09;
	$filename = $_FILES['filename']['name'];
	
	//Grab the selected file 
	//Uncomment this if we want to see what file we are uploading
	//$filename = $_FILES['filename']['name'];

	//Validate and move if applicable
	if(($validCheck = securityCheck($filename)))
	{
		//Parse the filename for its extension
		$dotLocation = strpos(".", $filename);
		$fileExtension = substr($filename, $dotLocation);
		echo "alert ($fileExtension");
		
		//Get the file type and see if there is syntax highlighting available
		fileCheck($fileExtension);
		//move the uploaded file to the directory of choice
		move_uploaded_file($_FILES['filename']['tmp_name'], $filePath);

		//Insert relevant information in the database
		$insertStmt = "INSERT INTO `xponline`.`documents` (`dID`, `dName`, `dLocation`) VALUES ('$fileID', '$filename', '$filePath');";
		$con = runquery($insertStmt);
	}
	
	//Detect the file type then set the appropriate flag to enable syntax hightlighting
	//I just want the file extenstion
//	$extensionPattern = "[.]";
//	$splitFileName = split($extensionPattern, $fileName);
//	echo "The filename is $splitFileName[0]";
//	echo "The file extension is $splitFileName[1]";
	
	



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
 *	Parameter: filename - the name and extension of the file
 *  this is uploaded
 *
 *	Returns: True - If the file type is valid
 *			 False - If the file type is not valid
 *
 *
 */
function securityCheck($filename)
{
	//Check for obvious executable files (.exe, a.out, etc...)
	if(stristr($filename, ".exe")|| stristr($filename, "a.out"))
	{
		echo "Error 002, cannot upload file!";
		return false;
	}
	return true;
	
}

/*
 * Function: fileCheck
 *
 * Purpose: Uses the file extension to determine
 * which type of file is being uploaded, and 
 * set the appropriate syntax highlighting flag
 * if appropriate.
 *
 * Parameters: extension - the file extension of the uploaded file
 *	
 * Returns: None
 *
 */
function fileCheck($extension)
{
	for($count = 0; $count < count($extensions); $count++)
	{
		if($extension == $extensions[$count]){ echo("found one"); }
	}
	
}

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
function fileDownload($docID)
{
	$name_query = "SELECT dName FROM documents WHERE dID = $docID";
//	$name_query = 'select dName from documents where dID = 9; LIMIT 0, 30 ';
	
	//Fool the browser into opening the save dialog
	header('Content-type: application/octet-stream');

	readfile('documents/doc90');

//	$fileName = mysql_query($name_query);
//	echo $fileName;
}
?>
