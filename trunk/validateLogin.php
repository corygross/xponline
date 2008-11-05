<?php
session_start();

//Clear session variables
$_SESSION['uID'] = null;
$_SESSION['uName'] = null;
session_destroy();

if(isset($_POST['login'])){
$email = addslashes($_POST['email']);
$pass = md5($_POST['pass']);

require_once "dbConnect.php";
$sql = "SELECT uID, uFName, uColor FROM users WHERE uEmail = '$email' AND uPass = '$pass';";
$result = runQuery($sql);

if(mysql_num_rows($result) == 1){
	$row = mysql_fetch_array($result);
	$_SESSION['uID'] = $row['uID'];
	$_SESSION['uName'] = $row['uFName'];
	$_SESSION['uColor'] = $row['uColor'];
	header( "Location: index.php" );
}
else{
	header( "Location: login.php?i&e=$email" );
}
}
else{
	header( "Location: login.php" );
}
?>