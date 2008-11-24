<?php
session_start();
require_once "dbConnect.php";
if(isset($_SESSION['uID']) == false || $_SESSION['uID'] == ""){
	header( "Location: login.php" );
}
if(isset($_SESSION['homeDir']) == false){
	$_SESSION['homeDir'] = realpath(".");
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
<head>
<title>XPonline</title>
<link rel="stylesheet" id="colorSchemeSS" href="<?php echo "colorSchemes/".$_SESSION['uColor'].".css"; ?>" type="text/css" />

<script language="javascript" src="prototype.js"></script>
<script language="javascript" src="xparse.js"></script>
<script language="javascript" src="JSprototypes.js"></script>
<script language="javascript" src="documentManagement.js"></script>
<script language="javascript" src="editMenu.js"></script>
<script language="javascript" src="viewMenu.js"></script>
<script language="javascript" src="menu.js"></script>
<script language="javascript" src="windows.js"></script>
<script language="javascript" src="bm.js"></script>
<script language="javascript" src="controls/contact_search/suggest_script.js"></script>
<script language="javascript" src="messenger.js"></script>
<script language="javascript" src="clientConnection.js"></script>
<script	language="javascript" src="editor/toggleSH.js"></script>
<script language="javascript" src ="syntaxHighlight/javaWords.js"></script>
<script language="javascript" src="tokensearch.js"></script>
<script language="javascript" src="writeSpans.js"></script>
<script language="javascript" src="editor/RendererClass.js"></script>
<script language="javascript" src="editor/TextDocumentClass.js"></script>
<script language="javascript" src="editor/userInputLogic.js"></script>
</head>

<body style="margin:0px;padding:0px;" onload="init()">

<table style="width:100%;height:100%;" border="0">
<tr class="top_row" style="height:32px;">
<td>

<table style="width:100%;">
<tr>
<td>

<?php
require_once "menu.php";
?>

</td>

<td>
<table style="margin-left:auto; margin-right:0px;">
<tr>
<td class="details"><span id="curLineCol" name="curLineCol"></span></td>
<td class="details">&nbsp;&nbsp;&nbsp;<span id="fileName" name="fileName"></span></td>
</tr>
</table>
</td>
</tr>
</table>

</td>
<td id="mess1" style="width:175px;">
<table style="width:100%;">
<tr>
<td class="arrows" style="width:25%;" onclick="hideMessenger();">
&nbsp;&#8250;&#8250;&nbsp;
</td>
<td style="width:50%;">
<div class="messenger_head">Messenger</div>
</td>
<td style="width:25%;">
</td>
</tr>
</table>
</td>
<td id="collapse1" style="display:none;">
</td>
</tr>
<tr>
<td>
<div id="content">
<?php
require_once "./editor/editor.html";
?>
</div>
</td>
<td  id="mess2" valign="top">
<?php
require_once "messenger.php";
?>
</td>
<td id="collapse2" class="collapsed" style="display:none;" valign="top">
<table>
<tr>
<td class="arrows" onclick="showMessenger();">
&nbsp;&#8249;&#8249;&nbsp;
</td>
</tr>
<tr>
<td>
<div class="messenger_head">
M<br />E<br />S<br />S<br />E<br />N<br />G<br />E<br />R
</div>
</td>
</tr>
<tr>
<td>
<div id="waiting_msg" style="text-align:center;display:none;">
<img src="images/red-blink.gif" align="middle"/>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
<div name="loadingIndicator" id="loadingIndicator" style="position:absolute;display:none;">
<img src="images/red-loading.gif" alt="loading..." />
</div>
</body>
</html>

<script language="JavaScript" type="text/javascript">
function getHeight() {
  var myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    myHeight = window.innerHeight;
  } else if( document.documentElement && document.documentElement.clientHeight ) {
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && document.body.clientHeight ) {
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}
document.getElementById('content').style.height = (getHeight() - 37) + "px";
</script>