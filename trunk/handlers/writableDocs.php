<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];

if($uID == ""){
	echo "Please log in.";
	return;
}
?>

<select id='writableList' name='writableList' style='width:100%;' size='8'>
<?php

$docsSQL = "SELECT documents.* FROM access,documents WHERE access.uID='$uID' AND access.dID=documents.dID AND access.accessLvl='w' ORDER BY documents.dName ASC;";
$docsResult = runQuery($docsSQL);

if(mysql_num_rows($docsResult) > 0){
	while ($row = mysql_fetch_array($docsResult))
	{			
		echo "<option value='".$row['dID']."'>".$row['dName']."</option>";
	}
}
?>
</select>