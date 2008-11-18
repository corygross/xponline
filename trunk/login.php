<?php
session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
	<title>XPonline | Login</title>
	<!--link rel="stylesheet" href="style.css" type="text/css" / -->
	<!--link rel="stylesheet" href="login_reg.css" type="text/css" / -->
</head>
<body>
	<form name="login" id="login" method="post" action="validateLogin.php">
		<h2>Welcome to XPonline!</h2>
		<h3>Please login:</h3>
		<?php
			if(isset($_GET['i']))
			{
				print("<div id=\"error\">Incorrect login - please try again</div>");   
			}
		?>

		<label>Email:</label><br />
		<input type="text" name="email" id="email" value="<?php echo $_GET['e']; ?>" />
		<br />
		<label>Password:</label><br />
		<input type="password" name="pass" id="pass" />
		<br />
		<input type="submit" name="login" id="login" value="Login" />
		<input type="button" name="register" id="register" value="Register" onClick="location.href='register.php';" />
		<h2>Project Description</h2>
		<p>A description of our project goes here...</p>
	</form>
	<script>document.getElementById('email').focus();</script>
</body>
</html>