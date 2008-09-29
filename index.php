<?php
session_start();
if(isset($_SESSION['uID']) == false || $_SESSION['uID'] == ""){
	header( "Location: login.php" );
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>XPonline</title>
</head>
<body>
<?php
echo "Welcome " . $_SESSION['uName'] . "!";
?>
<br /><br />
This will be the main project page...
</body>
</html>