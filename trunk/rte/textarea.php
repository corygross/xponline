<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">

<html>
<head>
	<title>Cross-Browser Rich Text Editor</title>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<meta name="PageURL" content="http://www.kevinroth.com/rte/demo.htm" />
	<meta name="PageTitle" content="Cross-Browser Rich Text Editor" />
	<!-- To decrease bandwidth, change the src to richtext_compressed.js //-->
	<script language="JavaScript" type="text/javascript" src="richtext.js"></script>
</head>
<body>

<table style="width:100%;height:100%">
<tr>
<td style="width:80%">
<form name="RTEDemo" action="textarea.php" method="post" onsubmit="return submitForm();">

<script language="JavaScript" type="text/javascript">
<!--
function submitForm() {
	//make sure hidden and iframe values are in sync before submitting form
	//to sync only 1 rte, use updateRTE(rte)
	//to sync all rtes, use updateRTEs
	//updateRTE('rte1');
	updateRTEs();
	//alert("rte1 = " + document.RTEDemo.rte1.value);
	alert("rte2 = " + document.RTEDemo.rte2.value);
	//alert("rte3 = " + document.RTEDemo.rte3.value);
	
	//change the following line to true to submit form
	return false;
}

//Usage: initRTE(imagesPath, includesPath, cssFile)
initRTE("images/", "", "");
initRTE("images/", "", "rte.css");
//-->
</script>
<noscript><p><b>Javascript must be enabled to use this form.</b></p></noscript>

<script language="JavaScript" type="text/javascript">
<!--
//Usage: writeRichText(fieldname, html, width, height, buttons, readOnly)
//writeRichText('rte1', 'here&#39;s the "<em>preloaded</em> <b>content</b>"', 520, 200, true, false);

//document.writeln('<br><br>');
//document.writeln('<table>');
//document.writeln('<tr>');
//document.writeln('<td style="width:80%">');
writeRichText('rte2', 'preloaded <b>text</b>', getWidth()*.8, getHeight(), false, false);
//writeRichText('rte2', 'preloaded <b>text</b>', 560, 100, true, false);
//document.writeln('</td>');
//document.writeln('<td style="width:20%">');
//document.writeln('</td>');
//document.writeln('</tr>');
//document.writeln('</table>');

//document.writeln('<br><br>');
//writeRichText('rte3', 'preloaded <b>text</b>', 450, 100, true, true);
//-->

function getWidth() {
  var myWidth = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
  }
  //window.alert( 'Width = ' + myWidth );
  return myWidth;
}

function getHeight() {
  var myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myHeight = document.body.clientHeight;
  }
  //window.alert( 'Height = ' + myHeight );
  return myHeight;
}
</script>

<p>Click submit to show the value of the text box.</p>
<p><input type="submit" name="submit" value="Submit"></p>
</form>
</td>
<td style="width:20%;background:steelblue">
<center>
messenger here
</center>
</td>
</tr>
</table>

</body>
</html>