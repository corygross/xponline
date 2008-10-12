<script type="text/javascript" src="prototype.js"></script>
<script language="javascript" src="messenger.js"></script>
	
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

<ul id="contactList" name="contactList" class="contacts">
<!-- this is updated with the current contact list -->
</ul>

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
<tr>
<td id="pendingButton" name="pendingButton">
<!-- this is updated with the button to confirm contacts -->
</td>
</tr>
</table>