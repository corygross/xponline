<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
$dID = $_GET['docID'];

// The action is whether it is an update, insert, or delete
$action = $_GET['action'];

// The text is what text we want to change our line to
$text = $_GET['text'];

// The ID of the line we want to manipulate
$lineNum = $_GET['lNum'];

if($uID == "" || $dID == "" || $action == "" || $lineNum == ""){
	echo "missing info";
	return;
}


// TODO: check to make sure the user has write access to the document

// TODO: see if anything needs to be done beforehand - anything that might conflict or change line numbers

// Add our changes that need to be made to the database so other users can find out about them
$insert_update_query = "INSERT INTO updates VALUES(null,'$dID','$uID','$lineNum','$action','$text',CURRENT_TIMESTAMP);";
$updateResult = runQuery($insert_update_query);
$updateID = mysql_insert_id();

// Now see if there are any other users working on the same document
// If so, queue up the changes for them
$active_user_query = "SELECT uID FROM access WHERE dID='$dID' AND uID!='$uID' AND (dLastActivity>DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 10 SECOND));";
$activeResult = runQuery($active_user_query);
if(mysql_num_rows($activeResult) > 0){
	while ($row = mysql_fetch_array($activeResult))
	{
		$update_queue_insert = "INSERT INTO updatequeue VALUES('$updateID','".$row['uID']."');";
		$updateQueueResult = runQuery($update_queue_insert);
	}
}


// Update the physical document
$fileName = "../documents/doc".$dID;
if(file_exists($fileName)){
	if($action == "u"){
		updateLine($fileName, $lineNum, $text);
	}
	else if($action == "i"){
		insertLine($fileName, $lineNum, $text);
	}
	else if($action == "d"){
		deleteLine($fileName, $lineNum);
	}
}

function updateLine($fileName, $lineNum, $lineText){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $lineNum){
		echo "line not found";
		return;
	}
	$fileHandle[$lineNum] = $lineText."\n";
	file_put_contents($fileName, $fileHandle);
}

function insertLine($fileName, $position, $lineText){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $position){
		echo "line not found";
		return;
	}
	array_splice($fileHandle,$position,0,$lineText."\n");
	file_put_contents($fileName, $fileHandle);
}

function deleteLine($fileName, $lineNum){
	$fileHandle = file($fileName);
	if(count($fileHandle) < $lineNum){
		echo "line not found";
		return;
	}
	$beforeLine = array_slice($fileHandle, 0, $lineNum);
	$afterLine = array_slice($fileHandle, $lineNum + 1);
	$fileHandle = array_merge($beforeLine, $afterLine);
	file_put_contents($fileName, $fileHandle);
}

?>