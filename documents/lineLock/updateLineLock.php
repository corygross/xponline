<?php
session_start();
require_once "../../dbConnect.php";

$uID = $_SESSION['uID'];
$dID = $_GET['docID'];

$curLine = $_GET['curLine'];

if($uID == "" || $dID == "" || $curLine == ""){
	return;
}

// userID,lineNum,time???\n
$lockInfo = $uID.",".$curLine.",".$_SESSION['uName'];

$fileName = "doc".$dID."-lock";
if(file_exists($fileName)){
	$toWriteBack = "";
	$fileHandle = fopen($fileName, 'r') or die("can't open file");
	$wholeFile = fread($fileHandle, filesize($fileName)+1);
	fclose($fileHandle);

	$lineArray = explode("\n", $wholeFile);
	foreach($lineArray as $line){				
		$lineParts = explode(",", $line);
		if($lineParts[0] != $uID){
			// See if the user has been active in that document in the last 10 seconds
			$sqlCheckStillActive = "SELECT * FROM access WHERE dID='$dID' AND uID='$lineParts[0]' AND (dLastActivity>DATE_SUB(CURRENT_TIMESTAMP,INTERVAL 30 SECOND));";
			$result = runQuery($sqlCheckStillActive);
			if(mysql_num_rows($result) > 0){
				$toWriteBack .= "\n" . $line;
			}
		}
	}
    
	$lockInfo .= $toWriteBack;
}

$fileHandle = fopen($fileName, 'w') or die("can't open file");
fwrite($fileHandle, $lockInfo);
fclose($fileHandle);

//$lastModifyKey = 'lastFileModify'.$dID;
//$_SESSION["$lastModifyKey"] = filemtime($fileName);

?>