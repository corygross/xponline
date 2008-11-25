<?php
session_start();

$error = "";

if(isset($_POST['btnRegister']) == true)
{
	$fName = trim(addslashes($_POST['fName']));
	$lName = trim(addslashes($_POST['lName']));
	$email = trim(addslashes($_POST['email']));
	$pass1 = trim($_POST['pass1']);
	$pass2 = trim($_POST['pass2']);
	
	if($fName == ""){
		$error .= "Please enter your first name" . "<br />";
	}
	if($lName == ""){
		$error .= "Please enter your last name" . "<br />";
	}
	if($email == ""){
		$error .= "Please enter your email address" . "<br />";
	}
	//check email validity here
	if($pass1 == "" || $pass2 == ""){
		$error .= "Please enter a password" . "<br />";
	}
	else if($pass1 != $pass2){
		$error .= "Your passwords do not match" . "<br />";
	}
	else if(strlen($pass1) < 6){
		$error .= "Your password must be at least 6 characters long" . "<br />";
	}
	
	if($error == ""){
		require_once "dbConnect.php";
		$checkSQL = "SELECT uID FROM users WHERE uEmail = '$email';";
		$resEmail = runQuery($checkSQL);
		if(mysql_num_rows($resEmail) > 0){
			$error .= "An account already exists for that email address" . "<br />";
		}
		else{
			$regSQL = "INSERT into users (uFName,uLName,uEmail,uPass,uColor) VALUES ('".$fName."','".$lName."','".$email."','".md5($pass1)."','black');";
			$result = runQuery($regSQL);
			$newID = mysql_insert_id();
			$_SESSION['uID'] = $newID;
			$_SESSION['uName'] = $fName." ".$lName;
			$_SESSION['uColor'] = 'black';
			header( "Location: index.php" );
		}
	}
}
//Cancel button
else 
	if(isset($_POST['btnCancel']) == true)
	{
		header("Location: login.php");
	}
else{
	$fName = "";
	$lName = "";
	$email = "";
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>XPonline | Register</title>
<!--link rel="stylesheet" href="style.css" type="text/css" /-->
<link rel="stylesheet" href="login_reg.css" type="text/css" />
</head>
<body class="gradient">

<!-- Not sure why I don't display in IE 7' -->
<div id="image_div" align="center">
	<img src ="images/logo.png" alt="XP Online logo"/> 
</div>
<!-- encapsulate all of the html goodies -->
<div id="form_div" align="center">
<form name="register" id="register" method="post" action="register.php">
<h3>Register for XP Online</h3>
<?php
if($error != ""){
	print("<div id=\"error\">$error</div>");   
}
?>
<label>First name</label><br />
<input type="text" name="fName" id="fName" value="<?php echo $fName; ?>" />
<br />
<br />
<label>Last Name</label><br />
<input type="text" name="lName" id="lName" value="<?php echo $lName; ?>" />
<br />
<br />
<label>Email</label><br />
<input type="text" name="email" id="email" value="<?php echo $email; ?>" />
<br />
<br />
<label>Password</label><br />
<input type="password" name="pass1" id="pass1" />
<br />
<br />
<label>Confirm password</label><br />
<input type="password" name="pass2" id="pass2" />
<br />
<br />
<br />
<br />
<input type="submit" name="btnRegister" id="regBtn" value="" />
&nbsp
&nbsp
<input type="submit" name="btnCancel" id="cancelBtn" value="" />
</form>
<script>document.getElementById('fName').focus();</script>
</div>
</body>
</html>