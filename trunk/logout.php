<?php
session_start();

$_SESSION['uID'] = null;
$_SESSION['uName'] = null;
session_destroy();

header( "Location: login.php" );
?>