<?php
session_start();
require_once "../dbConnect.php";

$uID = $_SESSION['uID'];
?>

<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Confirm contact requests:</td><td style='width:10%;'></td></tr>
<tr><td>&nbsp;</td><td></td><td></td></tr>
<?php
$requestsSQL = "SELECT * FROM contacts,users WHERE ((uID1 = $uID AND u1Accept = 0 AND uID = uID2) OR (uID2 = $uID AND u2Accept = 0 AND uID = uID1));";
$reqResult = runQuery($requestsSQL);
while ($row = mysql_fetch_array($reqResult))
{	
	echo "<tr><td><input type='checkbox' name='confContacts' value='".$row['uID']."'></td><td>".$row['uFName']." ".$row['uLName']."</td><td></td></tr>";
}
?>
<tr><td></td><td align='right'><input type='button' value='Cancel' onClick="hidePopup('confirmContact');"/><input type='button' value='Confirm' onClick='confirmContacts(document.confirmForm.confContacts);'/></td><td></td></tr>
</table>