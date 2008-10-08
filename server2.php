<?php
$myId = "001";

echo $_POST['input'];


//Connect to database
$link = mysql_connect('localhost', 'root', 'root') or die('could not connect'.mysql_error());
$output_query = "SELECT * FROM msgqueue WHERE mID = $myId";

//Select our database
mysql_select_db("xponline", $link);

if (ob_get_level() == 0) ob_start();

/*
 * Retrieves a message from the message queue
 *
 * 
 *
 *
 */
function getMessage()
{
	$resultSet = mysql_query($GLOBALS['output_query']);

	while ($row = mysql_fetch_array($resultSet))
	{
		echo $row['msg'];
		echo "</br>";
	 	echo str_pad('',4096)."\n";  //Safari need xx characters to first recognize pushed content.
		echo "</body>"; //This is key to have this here, at least for Safari
		ob_flush();
	    flush();
	   	sleep(5);

	}
	
}

function insertMessage($uid, $meId, $inMsg)
{
	
}
for ($i = 0; $i<10; $i++) { getMessage(); }

ob_end_flush(); //necessary

mysql_close($link); //Close the connection when done

/*
	Things to do server side
	1. Receive input from the client
	2. Accept multiple client connections
	3. Create table of sockets associated with users
	4. Send text from one client to another.

*/
?>