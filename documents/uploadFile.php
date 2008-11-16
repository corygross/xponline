<?php
require_once '../dbConnect.php';

$uID = $_SESSION['uID'];

if($uID == ""){
	sendResult("Please log in.","","");
	return;
}

// Where on the server are we going to store these files?
$filePath = "documents";

$filename = $_FILES['filename']['name'];

// Uncomment this if we want to see what file we are uploading
//$filename = $_FILES['filename']['name'];

if((securityCheck($filename) == false))
{
	return;
}

// Insert relevant information in the database
$insertStmt = "INSERT INTO documents (`dID`, `dName`, `dLocation`) VALUES (null, '$filename', '$filePath');";
$con = runQuery($insertStmt);

// The newly created document ID
$newID = mysql_insert_id();

// Give the creating user write access
$sql = "INSERT INTO access VALUES('$newID', '$uID', 'w', CURRENT_TIMESTAMP);";
$response = runQuery($sql);

// Our new unique document name
$docNameOnFileSystem = "doc" . $newID;

// Move the uploaded file to the directory of choice
move_uploaded_file($_FILES['filename']['tmp_name'], $docNameOnFileSystem);

sendResult("success",$newID,$filename);

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
		sendResult("The file failed the security check and was not uploaded.","","");
		return false;
	}
	return true;
	
}

// Send a result back to the client, which will run the 'uploadComplete' javascript function
function sendResult($result, $newDocID, $filename)
{
?>
<script language="javascript" type="text/javascript">window.top.window.uploadComplete(<?php echo "'".$result."','".$newDocID."','".$filename."'"; ?>);</script>   
<?php
}


?>
