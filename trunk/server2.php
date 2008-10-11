<?php
$myId = "001";

static $messageId = 0;
$messageId++;

if (isset($_GET["input"]))
{
	$userInput = $_GET["input"];
}
else
{
	$userInput = '';
}
//$userInput = $_GET["input"];
$tokenArray =  array();

//echo "userInput is $userInput";


//Connect to database
$link = mysql_connect('localhost', 'root', 'root') or die('could not connect'.mysql_error());
$output_query = "SELECT * FROM msgqueue WHERE mID = $myId";

//Select our database
mysql_select_db("xponline", $link);

if($userInput != '')
{
	//Only perform parsing actions if the user has sent a message
	$tokenArray = parseInput($userInput);
	
	//Add message to the message queue
	insertMessage($tokenArray);
}

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
		//Wait a second
	   	usleep(1000000);

	}
	
}

/*
 * Insert the user sent data into message queue
 *
 *
 */
function insertMessage($inArray)
{
	$input1 = $inArray[0];
	$input2 = $inArray[1];
	$input3 = $inArray[2];

	static $msgId = 0;
	$msgId++;
	//Constrct the query string from user parameters and execute
	//$insertQuery = "INSERT into msgqueue (mId, fromID, toID, msg, sentTime) VALUES ('3', '2', '1', 'Test', '2008-10-07 19:44:2')" or die("error with insert");
//	$sql = 'INSERT INTO `xponline`.`msgqueue` (`mID`, `fromID`, `toID`, `msg`, `sentTime`) VALUES ('$input1', 2, 1, "ron is testing again 3", CURRENT_TIMESTAMP);';
	$sql = "INSERT INTO msgqueue VALUES('$msgId', '$input1', '$input2', '$input3', CURRENT_TIMESTAMP)";
	$result = mysql_query($sql);
	echo mysql_errno(). ": " . mysql_error();
}

/*
 * parseInput
 *
 * Extracts the relevant tokens from the 
 * user input string.
 *
 *
 */
function parseInput($uInput)
{
	//String should arrive in the format sentId/toID/Message
	$tokens = split("/", $uInput);
	return $tokens;
	
}



//Check for messages, and if found, send to client
for ($i = 0; $i<10; $i++) { getMessage(); }

ob_end_flush(); //necessary
//echo $_GET['input'];
mysql_close($link); //Close the connection when done

?>