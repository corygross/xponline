var startTop,startLeft;
var offsetTop,offsetLeft;
var myWindow;
var z = 10;

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

function openChat(id, title){
	openPopup(id, title, 'chat');
}

function openPopup(id, title, type){
	if(document.getElementById(id) == null){
		makeNewPopup(id, title, type);
	}
	else{
		makePopupVisible(id);
	}
}

var windowCount = 0;
var lastNewTop = 0;
var lastNewLeft = 100;
function makeNewPopup(id, title, type){
//var popupID = "mypopup" + windowCount;
var popupID = id;
windowCount++;

if(lastNewTop == 0 || lastNewTop > 250){
	lastNewTop = 100;
}
else{
	lastNewTop += 15;	
}
lastNewLeft += 15;

var newElm = document.createElement("div");
newElm.setAttribute('id',popupID);
newElm.setAttribute('name',popupID);
newElm.setAttribute("style","position: absolute; width: 300px; display: none; top:"+lastNewTop+"px;left:"+lastNewLeft+"px;");
//newElm.setAttribute("style","position: absolute; width: 300px; height: 350px; display: none; top:"+lastNewTop+"px;left:"+lastNewLeft+"px;");
newElm.setAttribute("class","window");

newElm.onmousedown = moveToFront;

//an IE fix
var ua = navigator.userAgent.toLowerCase();
if((ua.indexOf("msie") != -1)){
newElm.style.setAttribute("cssText","position: absolute; width: 300px; display: none; top:"+lastNewTop+"px;left:"+lastNewLeft+"px;",0);
newElm.className = "window";
}

var newHTML = "";
newHTML += "<div class='window_head' onmousedown=\"grab('" + popupID + "', event);\">";
newHTML += "<table style='width:100%;'><tr style='width:100%;'><td style='width:10%;'></td><td style='width:80%;'>"+title+"</td><td class='window_min' onClick=\"hidePopup('"+popupID+"')\">&#8211;</td></tr></table></div>";

if(type == 'chat'){
newHTML += "<textarea style='width: 98%;' rows='12' readonly='readonly'>" + popupID + "</textarea>";
newHTML += "<br/>";
newHTML += "<textarea style='width:98%;' rows='4'></textarea>";
}
else if(type == 'addBM'){
newHTML += "<form name='addBMForm'><table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a bookmark type:</td><td style='width:10%;'></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='TODO' checked='checked'/>TODO</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='FIXME'/>FIXME</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='HACK'/>HACK</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td>Write a comment:</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td><textarea id='bmText' style='width:98%;' rows='4'></textarea></td><td></td></tr>";
newHTML += "<tr><td></td><td align='right'><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/><input type='button' value='Ok' onClick=\"addBM('"+popupID+"')\"/></td><td></td></tr>";
newHTML += "</table><br /></form>";
}
else if(type == 'findBM'){
var bmHash = {"10":"TODO: Write some code here","23":"TODO: Fix this","42":"TODO: Make more efficient"};

newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Current bookmarks:</td><td style='width:10%;'></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td>";
newHTML += "<div style='overflow:auto;background-color:white;margin-left:5px;margin-right:5px;height:250px;'>";
newHTML += "<ul class='bms'>";
for (key in bmHash) {
	newHTML += "<li class='bm' onClick=\"selectBM(this,'"+key+"');\">"+bmHash[key]+"</li>";
}
newHTML += "</ul></div>";
newHTML += "</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
newHTML += "<tr><td></td><td align='right'><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/><input type='button' value='Ok' onClick=\"goToBM('"+popupID+"');\"/></td><td></td></tr>";
newHTML += "</table><br />";
}
else if(type == 'color'){
newHTML += "<form><table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a color scheme:</td><td style='width:10%;'></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='color' value='black'/>Black</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='color' value='blue'/>Blue</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='color' value='gray'/>Gray</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
newHTML += "<tr><td></td><td align='right'><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/><input type='button' id='submitColor' name='submitColor' value='Ok'/></td><td></td></tr>";
newHTML += "</table>";
newHTML += "</form>";
}
else if(type == 'addContact'){
newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Search for a contact:</td><td style='width:10%;'></td></tr>";
newHTML += "<tr><td></td><td>";
newHTML += "<div id='search-wrap'>";
newHTML += "<input name='search-q' id='search-q' type='text' onkeydown='checkTabKey(event)' onkeyup='autosuggest(event)'/><br />";
newHTML += "</div><div id='results'></div>";
newHTML += "</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td>Note: Before you can chat with a new contact, they must first confirm you as a contact.</td><td></td></tr>";
newHTML += "<tr><td></td><td align='right'><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"');\"/><input type='button' id='btnAddContact' name='btnAddContact' value='Add' disabled='disabled' onClick='addContact();'/></td><td></td></tr>";
newHTML += "</table>";
}

newElm.innerHTML = newHTML;
document.body.appendChild(newElm);

makePopupVisible(popupID);
}

function makePopupVisible(id) {
	var window = document.getElementById(id);
	window.style.display = "block";
	moveToFrontAgain(window);
}

function hidePopup(id){
	document.getElementById(id).style.display="none";
}

function destroyPopup(id){
	document.getElementById(id).outerHTML = "";
}

function moveToFront(){
	this.style.zIndex = z++;
}

function moveToFrontAgain(window){
	window.style.zIndex = z++;
}