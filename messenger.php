<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<title>client</title>
   <script type="text/javascript" src="prototype.js"></script>
</head>
<body>
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
<li class="contact_new_msg" onClick="openPopup('user1','Another User 1','chat');">Another User 1</li>
<li class="contact_old_msg" onClick="openPopup('user2','Another User 2','chat');">Another User 2</li>
<li class="contact" onClick="openPopup('user3','Another User 3','chat');">Another User 3</li>
</li>
</ul>
<li><div class="contact_group" onClick="showHideMessengerGroup('offline');changeMessengerArrow('offline_arrow');"><img id="offline_arrow" src="images/arrow.gif">&nbsp;Offline</div>
<ul id="offline" class="contacts" style="display: none;">
<li class="contact_new_msg">another user</li>
<li class="contact_old_msg">another user</li>
<li class="contact">another user</li>
<li class="contact">another user</li>
<li class="contact_new_msg">another user</li>
<li class="contact_old_msg">another user</li>
<li class="contact">another user</li>
</ul>
</li>
</ul>
Received:<br />
<input type="text" name="received" value="" id="received"><br/>

<iframe id="foo" name="foo" style="display:none"></iframe>
	

<form id="theForm" action="./server2.php" method="get" accept-charset="utf-8" target="foo" onsubmit="comet.doRequest($('input').value)">
	Received:<input type="text" name="received" value="" id="response"><br/>
	Message:<input type="text" name="input" value="" id="input"><br/>
	<p><input type="submit" value="submit"></p>


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
	<script type="text/javascript">
	
		//Create the Comet "object"
		var Comet = Class.create();
		
		//Set the properties and methods of the class
		Comet.prototype = {
			url:'./server2.php',
			noerror:true,
			initialize: function(){},
			
			//Define the connection function
			connect:function()
				{
					//Create the AJAX object that inititiate the ajax connection
					this.ajax = new Ajax.Request(this.url, 
						{
							method:'get',
							//On a successful response 
							onSuccess:function(transport)
							{
								alert("Connection successful!");
								var response = transport.responseText;
								document.write("I, the client have received " + response);
							},
						
							//When the request is completed
							onComplete:function()
							{
								alert("complete method");
								//Immediately reconnect
								this.comet.connect();  //Connect immeidietly after disconnect (e.g. long polling!)
							},
							onInteractive:function(transport)
							{
								var elements = Form.getElements('theForm');
								elements[0].value = "";
								elements[0].value = transport.responseText;
								
//									//alert("Got something.");
//									alert(transport.responseText);
//									$('response').setValue(transport.responseText);
							},
							//If there is an error along the way
							onError:function()
							{
								alert("Error");
							}
						}
					);
					this.ajax.comet=this;
				
				},
				handleResponse: function(response)
			    {
			      $('content').innerHTML += '<div>' + response['msg'] + '</div>';
			    },
			  doRequest: function(request)
			    {
				var elements = Form.getElements('theForm');
				elements[1].value = '';
				var input = $('theForm').getInputs('text');
				alert("request is  " + request);
				$('theForm').request({
					method:'get',
					parameters:{input:request},
					onInteractive:function(transport){/*alert(transport.responseText);*/ elements[0].value = ""; elements[0].value = transport.responseText; },
					onComplete:function(){this.comet.connect();}
				}
					)
				}
			}
/*			      new Ajax.Request('./server2.php', {
					method:'GET',
			        parameters: $('theForm').serialize(true)
			      });
				}*/	
					
//				alert("Create the comet instance");
		  var comet = new Comet();
//			alert("Call the connect method");
		comet.connect();
//		document.write("making initial request.");
	</script>

</body>
</html>


<tr>
<td>
<?php
/*
$uID = $_SESSION['uID'];
$requestsSQL = "SELECT * FROM contacts WHERE (uID1 = $uID AND u1Accept = 0) OR (uID2 = $uID AND u2Accept = 0);";
$reqResult = runQuery($requestsSQL);
$num = mysql_num_rows($reqResult);
if($num > 0){
echo "<div class='messenger_button' onClick=\"openPopup('confirmContact','Confirm contact request','confirmContact');\">";
if($num == 1){
	echo "1 contact request";
}
else if($num > 1){
	echo $num . " contact requests";
}
echo "</div>";
}
*/
?>

</td->
</tr>
</table>
