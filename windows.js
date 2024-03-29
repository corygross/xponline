var curOpenWindow = null;
var chatWindows = new Array();
var startTop,startLeft;
var offsetTop,offsetLeft;
var myWindow;
var z = 10;

function drag(e){
	e = getEvent(e);

	var cy	= e.clientY + offsetTop;	
	myWindow.style.top = cy + "px";
	
	var cx	= e.clientX + offsetLeft;
	myWindow.style.left = cx + "px";
}

function drop(){
	document.onmousemove = null;
	document.onmouseup   = null;
	myWindow = null;
}

function getEvent(e){
	if (typeof e == 'undefined') e = window.event;
	if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
	if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
	return e;
}

function grab(id, e) {
	e = getEvent(e);	
	myWindow = document.getElementById(id);

	startTop = parseInt(myWindow.style.top);
	startLeft = parseInt(myWindow.style.left);
	offsetTop = startTop - e.clientY;
	offsetLeft = startLeft - e.clientX;

	document.onmousemove = drag;
	document.onmouseup = drop;
	
	return false; //don't select text in some browsers
}

function openPopup(id, title, type){
	if(type != "chat"){
		if(curOpenWindow != null){
			alert("Please close open windows.");
			return;
		}
		curOpenWindow = id;
	}
	if(document.getElementById(id) == null){
		this.makeNewPopup(id, title, type);
	}
	else{
		makePopupVisible(id);
	}
}

this.makeNewPopup = function (popupID, title, type) 
{
	if( typeof(makeNewPopup.lastNewTop) == "undefined" ) makeNewPopup.lastNewTop = 0;
	if( typeof(makeNewPopup.lastNewLeft) == "undefined" ) makeNewPopup.lastNewLeft = 100;

	var leftEdge;
	var topEdge;

	if(type == 'chat'){
		if(makeNewPopup.lastNewTop == 0 || makeNewPopup.lastNewTop > 250) {	makeNewPopup.lastNewTop = 100; }
		else { makeNewPopup.lastNewTop += 15; }
		
		makeNewPopup.lastNewLeft += 15;
		
		leftEdge = makeNewPopup.lastNewLeft;
		topEdge = makeNewPopup.lastNewTop;
		
		chatWindows.push(popupID);
	}
	else{
		leftEdge = (screen.width/2) - 150;
		topEdge = 100;	
	}

	var newElm = document.createElement("div");
	newElm.setAttribute('id',popupID);
	newElm.setAttribute('name',popupID);
	newElm.setAttribute("style","position: absolute; width: 300px;background-color: #bebec9; display: none; top:"+topEdge+"px;left:"+leftEdge+"px;");
	newElm.setAttribute("class","window");

	newElm.onmousedown = moveToFront;

	//an IE fix
	var ua = navigator.userAgent.toLowerCase();
	if((ua.indexOf("msie") != -1)){
		newElm.style.setAttribute("cssText","position: absolute; width: 300px; background-color: #bebec9; display: none; top:"+topEdge+"px;left:"+leftEdge+"px;",0);
		newElm.className = "window";
	}

	var newHTML = "";
	newHTML += "<div class='window_head' onmousedown=\"grab('" + popupID + "', event);\">";
	newHTML += "<table style='width:100%;'><tr style='width:100%;'><td style='width:10%;'></td><td style='width:80%;font-size:1.5em;'>"+title+"</td><td class='window_min' onClick=\"contextClosePopup('"+popupID+"')\" ><img src='images/close.png' /></td></tr></table></div>";

	switch( type )
	{
		case 'chat':
		
			newHTML += "<form style='margin: 0px; padding: 0px;' onkeydown='closeOnEscape(event, \""+popupID+"\");'>";
			newHTML += "<textarea id='rec"+popupID+"' name='rec"+popupID+"' style='width: 98%;' rows='12' readonly='readonly'></textarea>";
			newHTML += "<br/>";
			newHTML += "<textarea id='send"+popupID+"' name='send"+popupID+"' style='width:98%;' rows='4' onkeyup=\"checkEnter(event,'"+popupID+"');\"></textarea></form>";
			break;

		case 'upload':

			//Create the form that will allow file selection
			newHTML += "<iframe id='uploadIframe' name='uploadIframe' style='display:none'></iframe>";
			newHTML += "<div id ='filechooser' style='background-color: #bebec9' ><br />";
			newHTML += "<form id='fileForm' name='fileForm' method='post' action='uploadFile.php' enctype='multipart/form-data' target='uploadIframe'>";
			newHTML += "<input type='hidden' name='MAX_FILE_SIZE' value='5000000' />";
			newHTML += "&nbsp;<input type='file' id='filename' name='filename' value='' style='width:270px' /><br/>";
			newHTML += "&nbsp;&nbsp;&nbsp;<input type='submit' value='upload' onClick='submitUpload();'/>";
			newHTML += "</form><br />";
			newHTML += "</div>";
			break;
		
		case 'add_bm':

			newHTML += "<form name='addBMForm' id='addBMForm' onkeypress='callFunctionOnEnter(event, addBM);' style='background-color: #bebec9' onkeydown='closeOnEscape(event, \""+popupID+"\");'><table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a bookmark type:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='TODO' checked='checked'/>TODO</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='FIXME'/>FIXME</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='HACK'/>HACK</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td>Write a comment:</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><textarea id='bmText' style='width:98%;' rows='4'></textarea></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Ok' onClick=\"addBM()\"/><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/></td><td></td></tr>";
			newHTML += "</table><br /></form>";
			break;

		case 'find_bm':

			newHTML += "<form onkeypress='callFunctionOnEnter(event, goToBM);' style='background-color: #bebec9' onkeydown='closeOnEscape(event, \""+popupID+"\");'>";
			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Current bookmarks:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td>";
			newHTML += "<div style='overflow:auto;background-color:#bebec9;margin-left:5px;margin-right:5px;height:250px;'>";
			newHTML += "<ul class='bms'>";
			
			for (i=0; i<bookmarkArray.length; i++)
			{
				newHTML += "<li class='bm' onClick=\"selectBM(this,'"+bookmarkArray[i].lineID+"');\">"+bookmarkArray[i].lineText+"</li>";
			}
			
			newHTML += "</ul></div>";
			newHTML += "</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Ok' onClick='goToBM();'/><input type='button' value='Cancel' onClick=\"destroyPopup('"+popupID+"')\"/></td><td></td></tr>";
			newHTML += "</table><br /></form>";
			break;

		case 'color_pick':

			newHTML += "<form name='changeColorForm' id='changeColorForm' onkeypress='callFunctionOnEnter(event, changeColorScheme);' onkeydown='closeOnEscape(event, \""+popupID+"\");'><table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a color scheme:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='color' value='black' checked='checked'/>Black</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='color' value='blue'/>Blue</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='color' value='gray'/>Gray</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' id='submitColor' name='submitColor' value='Ok' onClick='changeColorScheme();'/><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/></td><td></td></tr>";
			newHTML += "</table>";
			newHTML += "</form>";
			break;

		case 'syntax_lang':

			newHTML += "<form name='changeSyntaxLangForm' id='changeSyntaxLangForm' onkeypress='callFunctionOnEnter(event, changeLiteLanguage);' onkeydown='closeOnEscape(event, \""+popupID+"\");'><table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a syntax highlighting type:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='synLang' value='java' checked='checked'/>Java</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='synLang' value='...'/>...</td><td></td></tr>";
			newHTML += "<tr><td></td><td><input type='radio' name='synLang' value='...'/>...</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' id='submitSynLang' name='submitSynLang' value='Ok' onClick='changeLiteLanguage()'/><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/></td><td></td></tr>";
			newHTML += "</table>";
			newHTML += "</form>";
			break;

		case 'addContact':

			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Search for a contact:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td></td><td>";
			newHTML += "<div id='search-wrap'>";
			newHTML += "<input name='search-q' id='search-q' type='text' onkeydown='checkTabKey(event)' onkeyup='autosuggest(event,\"notFriends\")'/><br />";
			newHTML += "</div><div id='results'></div>";
			newHTML += "</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td>Note: Before you can chat with a new contact, they must first confirm you as a contact.</td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' id='btnAddContact' name='btnAddContact' value='Add' disabled='disabled' onClick='addContact();'/><input type='button' value='Cancel' onClick=\"destroyPopup('"+popupID+"');\"/></td><td></td></tr>";
			newHTML += "</table>";
			break;

		case 'confirmContact':

			newHTML += "<form name='confirmForm' onkeydown='closeOnEscape(event, \""+popupID+"\");'><div id='pendingContainer' name='pendingContainer'><img src='images/red-loading-sm.gif' style='padding:2px 2px;' alt='loading...' />&nbsp;Retrieving...</div></form>";
			break;

		case 'new_blank':

			newHTML += "<form onkeypress='callFunctionOnEnter(event, newBlankDocument);' onkeydown='closeOnEscape(event, \""+popupID+"\");'>";
			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Enter a name for the new file:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><input id='newDocName' name='newDocName' type='text' style='width:100%' /></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Ok' onClick='newBlankDocument();'/><input type='button' value='Cancel' onClick=\"destroyPopup('"+popupID+"');\"/></td><td></td></tr>";
			newHTML += "</table></form>";
			break;

		case 'open_doc':

			newHTML += "<div id='openDocContainer' name='openDocContainer'><img src='images/red-loading-sm.gif' style='padding:2px 2px;' alt='loading...' />&nbsp;Retrieving...</div>";
			break;

		case 'grantAccess':

			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Search for a user:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td></td><td>";
			newHTML += "<div id='search-wrap'>";
			newHTML += "<input name='search-q' id='search-q' type='text' onkeydown='checkTabKey(event)' onkeyup='autosuggest(event,\"all\")'/><br />";
			newHTML += "</div><div id='results'></div>";
			newHTML += "</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td>Select a document:</td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><div id='accessDocContainer' name='accessDocContainer'><img src='images/red-loading-sm.gif' style='padding:2px 2px;' alt='loading...' />&nbsp;Retrieving document list...</div></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><form name='grantForm'><input type='radio' name='aLevel' value='r' checked='checked'/>Read<br />";
			newHTML += "<input type='radio' name='aLevel' value='w'/>Write<br />";
			newHTML += "<input type='radio' name='aLevel' value='n'/>None</form></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Grant' onClick='grantAccess();'/><input type='button' value='Cancel' onClick=\"destroyPopup('"+popupID+"');\"/></td><td></td></tr>";
			newHTML += "</table>";
			break;

		case 'find_text':

			newHTML += "<br /><form name='findForm' onkeypress='callFunctionOnEnter(event, findText);' onkeydown='closeOnEscape(event, \""+popupID+"\");'><table style='width:100%;'><tr><td style='width:25%;'></td><td style='width:50%;'></td><td style='width:25%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;Find what:</td><td><input id='textToFind' name='textToFind' type='text' style='width:95%' /></td><td><input type='button' value='Find Next' style='width:100%' onClick='findText();'/></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><input type='radio' name='findType' value='up' />Up<br />";
			newHTML += "<input type='radio' name='findType' value='down' checked='checked' />Down</td><td><input type='button' value='Count' style='width:100%' onClick='findCount();'/><br /><input type='button' value='Close' style='width:100%' onClick=\"hidePopup('"+popupID+"');\"/></td></tr>";
			newHTML += "<tr><td colspan='2'><input type='checkbox' id='findMatchCase' name='findMatchCase' value='matchCase' />&nbsp;Match case</td><td align='right'></td><td></td></tr>";
			newHTML += "</table></form>";
			break;

		case 'replace_text':

			newHTML += "<br /><form name='replaceForm' onkeypress='callFunctionOnEnter(event, findTextToReplace);' onkeydown='closeOnEscape(event, \""+popupID+"\");'><table style='width:100%;'><tr><td style='width:30%;'></td><td style='width:40%;'></td><td style='width:30%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;Find what:</td><td><input id='replaceTextToFind' name='replaceTextToFind' type='text' style='width:95%' /></td><td><input type='button' value='Find Next' style='width:100%' onClick='findTextToReplace();'/></td></tr>";
			newHTML += "<tr><td>&nbsp;Replace with:</td><td><input id='replacementText' name='replacementText' type='text' style='width:95%' /></td><td><input type='button' value='Replace' style='width:100%' onClick='replaceSelected();'/></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><input type='radio' name='findType' value='up' />Up<br />";
			newHTML += "<input type='radio' name='findType' value='down' checked='checked' />Down</td><td><input type='button' value='Replace All' style='width:100%' onClick='replaceAll();'/><br /><input type='button' value='Close' style='width:100%' onClick=\"hidePopup('"+popupID+"');\"/></td></tr>";
			newHTML += "<tr><td colspan='2'><input type='checkbox' id='findMatchCase' name='findMatchCase' value='matchCase' />&nbsp;Match case</td><td align='right'></td><td></td></tr>";
			newHTML += "</table></form>";
			break;

		case 'goto_window':

			newHTML += "<form onkeypress='callFunctionOnEnter(event, gotoLineGo);' onkeydown='closeOnEscape(event, \""+popupID+"\");'>";
			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Line number:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><input id='gotoLineInput' name='gotoLineInput' type='text' style='width:100%' /></td><td></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Go' onClick='gotoLineGo();'/><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"');\"/></td><td></td></tr>";
			newHTML += "</table></form>";
			break;

		case 'delete_doc':

			newHTML += "<form onkeypress='callFunctionOnEnter(event, deleteDocument);' onkeydown='closeOnEscape(event, \""+popupID+"\");'>";
			newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a document to delete:</td><td style='width:10%;'></td></tr>";
			newHTML += "<tr><td>&nbsp;</td><td><div id='deleteDocContainer' name='deleteDocContainer'><img src='images/red-loading-sm.gif' style='padding:2px 2px;' alt='loading...' />&nbsp;Retrieving document list...</div></td><td></td></tr>";
			newHTML += "<tr><td></td><td align='right'><input type='button' value='Delete' onClick='deleteDocument();'/><input type='button' value='Close' onClick=\"destroyPopup('"+popupID+"');\"/></td><td></td></tr>";
			newHTML += "</table></form>";
			break;

	}

	newElm.innerHTML = newHTML;
	document.body.appendChild(newElm);

	makePopupVisible(popupID);
}

function callFunctionOnEnter(ev, callFunction){
	callFunctionOnEnter(ev, callFunction, null);
}

function callFunctionOnEnter(ev, callFunction, param){
	var myEvt;
	if(window.event == null) myEvt = ev;
	else myEvt = window.event;
	
	var element = myEvt.target || myEvt.srcElement;
	
	if(myEvt.keyCode == 13 && element.type != 'button'){
		if(param == null) callFunction();
		else callFunction(param);
		// Overkill on the event suppression
		myEvt.returnValue=false;
		myEvt.cancel = true;
		myEvt.cancelBubble  = true;
		if (myEvt.preventDefault) myEvt.preventDefault();
		if (myEvt.stopPropagation) myEvt.stopPropagation();
		return false;
	}
}

function closeOnEscape( ev, paramID ){
	var myEvt;
	if(window.event == null) myEvt = ev;
	else myEvt = window.event;
	
	if(myEvt.keyCode == 27){
		contextClosePopup(paramID);
		// Overkill on the event suppression
		myEvt.returnValue=false;
		myEvt.cancel = true;
		myEvt.cancelBubble  = true;
		if (myEvt.preventDefault) myEvt.preventDefault();
		if (myEvt.stopPropagation) myEvt.stopPropagation();
		return false;
	}
}

function contextClosePopup(paramID){
	if(paramID.indexOf("chat") == -1){
		destroyPopup(paramID);
	}
	else{
		hidePopup(paramID);
	}
}

function destroyPopup(id){
	var pop = document.getElementById(id);
	pop.parentNode.removeChild(pop);
	curOpenWindow = null;
	giveDocumentFocus();
}

function hidePopup(id){
	giveDocumentFocus();
	//if the window being closed is not a chat window, we do not want to blank the current open window.
	if(id.indexOf("chat") == -1){
		curOpenWindow = null;
	}
	var popup = document.getElementById(id);
	if(popup != null && popup.style.display != "none"){
		popup.style.display="none";
		return true; // return true if we actually hid a popup
	}
	return false; // return false if we did NOT hide the popup
}

function makePopupVisible(id) {
	var window = document.getElementById(id);
	window.style.display = "block";
	moveToFrontAgain(window);
}

function moveToFront(){
	this.style.zIndex = z++;
}

function moveToFrontAgain(window){
	window.style.zIndex = z++;
}

function windowExists(id){
	if(document.getElementById(id)==null){
		return false;
	}
	return true;
}

function windowIsVisible(id){
	if(document.getElementById(id).style.display != "none"){
		return true;
	}
	return false;
}