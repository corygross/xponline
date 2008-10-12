<li><div class="contact_group" onClick="showHideMessengerGroup('online');changeMessengerArrow('online_arrow');"><img id="online_arrow" src="images/arrow-down.gif">&nbsp;Online</div>
<ul id="online" class="contacts">
<?php
require_once "updateOnlineContactList.php";
?>
</ul>
</li>
<li><div class="contact_group" onClick="showHideMessengerGroup('offline');changeMessengerArrow('offline_arrow');"><img id="offline_arrow" src="images/arrow.gif">&nbsp;Offline</div>
<ul id="offline" class="contacts" style="display: none;">
<?php
require_once "updateOfflineContactList.php";
?>
</ul>
</li>