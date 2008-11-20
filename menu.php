<table style="margin-left:0px; margin-right:auto;">

<tr>
<td class="menu_item" onmouseover="showmenu('file_menu')" onmouseout="hidemenu('file_menu')">File&nbsp;<img src="images/arrow.gif"/><br />
   <table class="menu" id="file_menu" width="160px">
   <tr><td class="menu" onclick="newMenuClick();"><u>N</u>ew...</td></tr>
   <tr><td class="menu" onclick="openMenuClick();"><u>O</u>pen...</td></tr>
   <tr><td class="menu" onclick="uploadMenuClick();"><u>U</u>pload New...</td></tr>
   <tr><td class="menu" onclick="downloadMenuClick();">Download</td></tr>
   <tr><td class="menu" onclick="accessMenuClick();">Grant Access...</td></tr>
   <tr><td class="menu" onclick="deleteMenuClick();">Delete...</td></tr>
   <tr><td class="menu" onclick="closeMenuClick();">Close</td></tr>
   <tr><td class="menu" onclick="exitMenuClick();">Exit</td></tr>
   </table>
</td>

<td class="menu_item" onmouseover="showmenu('edit_menu')" onmouseout="hidemenu('edit_menu')">Edit&nbsp;<img src="images/arrow.gif"/><br />
   <table class="menu" id="edit_menu" width="160px">
   <tr><td class="menu" onclick="findMenuClick();"><u>F</u>ind...</td></tr>
   <tr><td class="menu" onclick="replaceMenuClick();"><u>R</u>eplace...</td></tr>
   <tr><td class="menu" onclick="gotoMenuClick();"><u>G</u>o To...</td></tr>
   <tr><td class="menu" onclick="selectAllMenuClick();">Select <u>A</u>ll</td></tr>
   </table>
</td>

<td class="menu_item" onmouseover="showmenu('view_menu')" onmouseout="hidemenu('view_menu')">View&nbsp;<img src="images/arrow.gif"/><br />
   <table class="menu" id="view_menu" width="160px">
   <tr><td class="menu" onclick="colorMenuClick();">Color <u>S</u>cheme...</td></tr>
   <tr><td class="menu" onclick="highlighMenuClick();">Toggle <u>H</u>ighlight</td></tr>
   </table>
</td>
<td class="menu_item" onclick="addBookmarkMenuClick();">+Bookmark</td>
<td class="menu_item" onclick="findBookmarkMenuClick();">Find Bookmark</td>
<td class="menu_icon"><img src="images/cut.bmp" alt="Cut" onClick="cutIconClicked();"/></td>
<td class="menu_icon"><img src="images/copy.bmp" alt="Copy" onClick="copyIconClicked();"/></td>
<td class="menu_icon"><img src="images/paste.bmp" alt="Paste" onClick="pasteIconClicked();"/></td>
</tr>
</table>
<form id="super_form" style="margin: 0px; padding: 0px;" method="post" action="./handlers/downloadDocument.php">
	<input type="hidden" id="download" name="download" />
</form>