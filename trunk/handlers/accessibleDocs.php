<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
?>

<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a file to open:</td><td style='width:10%;'></td></tr>
<tr><td>&nbsp;</td><td>
<select id='openList' name='openList' style='width:100%;' size='10'>
<?php

$docsSQL = "SELECT documents.* FROM access,documents WHERE access.uID='$uID' AND access.dID=documents.dID ORDER BY documents.dName ASC;";
$docsResult = runQuery($docsSQL);

if(mysql_num_rows($docsResult) > 0){
	while ($row = mysql_fetch_array($docsResult))
	{			
		echo "<option value='".$row['dID']."'>".$row['dName']."</option>";
	}
}

?>
</select>
</td><td></td></tr>
<tr><td>&nbsp;</td><td>Note: Only documents that you have permission to access will appear here.</td><td></td></tr>
<tr><td>&nbsp;</td><td></td><td></td></tr>
<tr><td></td><td align='right'><input type='button' value='Cancel' onClick="destroyPopup('open_doc');"/><input type='button' value='Open' onClick="selectDocument('openList','open_doc');"/></td><td></td></tr>
</table>