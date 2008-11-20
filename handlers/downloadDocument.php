<?php
session_start();
//require_once "dbConnect.php"
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


//	$name_query = 'select dName from documents where dID = 9; LIMIT 0, 30 ';
	
	// We'll be outputting a PDF
//	header('Content-type: text/xml');

	// It will be called downloaded.pdf
//	header('Content-Disposition: attachment; filename="doc90.txt"');

	// The PDF source is in original.pdf
//	readfile('../documents/doc90');	
	
  //Specify file here from parameter?

//I need the document unique id and the name, and we 
//can go from there.'
if(isset($_SESSION['uID']) == false )
{
	$fileName="testerFail.fail";
}
else
{
$fileName = $_SESSION['dID'];
}
//Get the filename displayed during file downloads
//$name_query = "SELECT dName FROM documents WHERE dID = '$fileName'";
//$name_query = "select dName from documents where dID = '$fileName'"; 
//$fileNameReal = "SELECT dName FROM documents WHERE dID = '$fileName'";
//$results = mysql_query($fileNameReal);
$results = "fileToDownload.java";

//if($results == " "){$results = "testFailAgain.test";}

  $file = "../documents/doc".$fileName;
  header('Content-Description: File Transfer');
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment; filename='.$results);
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