<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>client</title>
   <script type="text/javascript" src="prototype.js"></script>
</head>
<body>
<script	type="text/javascript" src="chat.js" />
	<iframe id="foo" name="foo" style="display:none"></iframe>
	
<table style="width:100%;margin-bottom:auto;margin-top:0px;">
<tr>
<td>
&nbsp;
</td>
</tr>
<tr>
<td>
<div class="contacts_label">
Contacts
</div>
</td>
</tr>
<tr>
<td>
<div style="overflow:auto;background-color:white;margin-left:5px;margin-right:5px;height:250px;">
<ul class="contacts">
<li><div class="contact_group" onClick="showHideMessengerGroup('online');changeMessengerArrow('online_arrow');"><img id="online_arrow" src="images/arrow-down.gif">&nbsp;Online</div>
<ul id="online" class="contacts">
<li id="contactItem1" class="contact" onClick="openChat('1', 'Bob Bills');">Bob Bills</li>
<li id="contactItem2" class="contact" onClick="openChat('2', 'Frank Finnegin');">Frank Finnegin</li>
<li id="contactItem3" class="contact" onClick="openChat('3', 'Steve Short');">Steve Short</li>
</li>
</ul>
<li><div class="contact_group" onClick="showHideMessengerGroup('offline');changeMessengerArrow('offline_arrow');"><img id="offline_arrow" src="images/arrow.gif">&nbsp;Offline</div>
<ul id="offline" class="contacts" style="display: none;">
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
</ul>
</li>
</ul>


<!-- I help your page not redirect! Keep me here please! -->
<iframe id="foo" name="foo" style="display:none"></iframe>
	

<form id="theForm" action="./server2.php" method="get" accept-charset="utf-8" target="foo" onsubmit="comet.doRequest($('input').value)">
	Received:<input type="text" name="received" value="" id="response"><br/>
	Message:<input type="text" name="input" value="" id="input"><br/>
	<p><input type="submit" value="submit"></p>
</form>


</div>
</td>
</tr>
<tr>
<td>
<div class="messenger_button" onClick="openPopup('addContact','Add a Contact','addContact');">
+Contact
</div>
</td>
</tr>
</table>


</body>
</html>
