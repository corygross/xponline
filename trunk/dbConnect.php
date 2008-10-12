<?php
session_start();

$host = "localhost";
$username = "root";
$password = "spider";
$db = "xponline";

mysql_connect($host,$username,$password);
mysql_select_db($db) or die("Unable to select database");

function runQuery($sql){
	$result = mysql_query($sql) or die(mysql_error());
	return $result;
}

?>