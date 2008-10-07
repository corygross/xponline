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