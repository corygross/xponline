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
	//return;
}


// TODO: check to make sure the user has write access to the document


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