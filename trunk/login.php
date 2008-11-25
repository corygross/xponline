<?php
session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
	<title>XPonline | Login</title>
	<!--link rel="stylesheet" href="style.css" type="text/css" / -->
	<link rel="stylesheet" href="login_reg.css" type="text/css" />
</head>
<body class = "gradient">
	<div id="theForm" align = "center">
	<form name="login" id="login" method="post" action="validateLogin.php">
	<img src="images/logo.png" align="middle"/>
		<!--h3>Please login:</h3-->
		<?php
			if(isset($_GET['i']))
			{
				print("<div id=\"error\">Incorrect login - please try again</div>");   
			}
		?>
		<br />
		<br />
		<label class="lblTxt">Email:</label><br />
		<input type="text" class = "inputFields" name="email" id="email" value="<?php echo $_GET['e']; ?>" />
		<br />
		<br />
		<br />
		<br />
		<label class="lblTxt">Password:</label><br />
		<input type="password" class = "inputFields" name="pass" id="pass" />
		<br />
		<br />
		<br />
		<input type="submit" name="login" id="loginBtn" value="" />
		&nbsp;&nbsp;&nbsp;&nbsp;
<!--input type="button" src = "images/register_btn.png" name="register" id="register" value="Register" onClick="location.href='register.php';" /-->
		<input type="button" id="regBtn" onclick="location.href='register.php'" />
	</div>
	</form>
	<script>document.getElementById('email').focus();</script>
</body>
</html>