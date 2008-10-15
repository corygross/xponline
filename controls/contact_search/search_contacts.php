<?php 
	session_start();
	require_once "../../dbConnect.php";
	
	$uID = $_SESSION['uID'];

	$searchq = strip_tags($_GET['q']);
	$mode = strip_tags($_GET['mode']);

	if($mode == "notFriends"){
		if(str_word_count($searchq) == 2)
		{
			$splitStr = split(" ", $searchq);
			$getRecord_sql	=	'SELECT * FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR (users.uFName LIKE "'.$splitStr[0].'%" AND users.uLName LIKE "'.$splitStr[1].'%")) AND NOT EXISTS(SELECT * FROM contacts WHERE ((uID1='.$uID.' AND uID2=uID ) OR (uID2='.$uID.' AND uID1=uID))) ORDER BY users.uFName ASC, users.uLName ASC';
			//$getRecord_sql	=	'SELECT * FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR (users.uFName LIKE "'.$splitStr[0].'%" AND users.uLName LIKE "'.$splitStr[1].'%")) ORDER BY users.uFName ASC, users.uLName ASC';
		}
		else
		{
			$getRecord_sql	=	'SELECT users.* FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR users.uFName LIKE "'.$searchq.'%" OR users.uLName LIKE "'.$searchq.'%") AND NOT EXISTS(SELECT * FROM contacts WHERE ((uID1='.$uID.' AND uID2=uID ) OR (uID2='.$uID.' AND uID1=uID))) ORDER BY users.uFName ASC, users.uLName ASC';
			//$getRecord_sql	=	'SELECT users.* FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR users.uFName LIKE "'.$searchq.'%" OR users.uLName LIKE "'.$searchq.'%") ORDER BY users.uFName ASC, users.uLName ASC';
		}
	}
	if($mode == "all"){
		if(str_word_count($searchq) == 2)
		{
			$splitStr = split(" ", $searchq);
			$getRecord_sql	=	'SELECT * FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR (users.uFName LIKE "'.$splitStr[0].'%" AND users.uLName LIKE "'.$splitStr[1].'%")) ORDER BY users.uFName ASC, users.uLName ASC';
		}
		else
		{
			$getRecord_sql	=	'SELECT users.* FROM users WHERE (users.uID != '.$uID.') AND (users.uEmail LIKE "'.$searchq.'%" OR users.uFName LIKE "'.$searchq.'%" OR users.uLName LIKE "'.$searchq.'%") ORDER BY users.uFName ASC, users.uLName ASC';
		}
	}

	$getRecord = runQuery($getRecord_sql);
	if(strlen($searchq)>0){
	
	if(mysql_num_rows($getRecord) != 0)
	{
	echo '<ul>';
	$count = 0;
	while ($row = mysql_fetch_array($getRecord)) 
	{
	?>
		<li id='item<?php echo $count; $count++; ?>' title='<?php echo $row['uFName'] . " " . $row['uLName'] . "^*" . $row['uID']; ?>' onclick="selectItem('<?php echo $row['uFName'] . " " . $row['uLName']; ?>','<?php echo $row['uID']; ?>');"><a href="#"><?php echo $row['uFName'] . " " . $row['uLName']; ?><small><?php echo $row['uEmail']; ?></small></a></li>
	<?php 
	} 
	echo '</ul>';
	}
	?>
<?php } ?>