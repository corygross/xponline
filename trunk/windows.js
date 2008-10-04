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
newHTML += "<table style='width:100%;'><tr><td style='width:10%;'></td><td style='width:80%;'>Select a bookmark type:</td><td style='width:10%;'></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='todo'/>Todo</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='other1'/>other1</td><td></td></tr>";
newHTML += "<tr><td></td><td><input type='radio' name='bmType' value='other2'/>other2</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td></td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td>Write a comment:</td><td></td></tr>";
newHTML += "<tr><td>&nbsp;</td><td><textarea style='width:98%;' rows='4'></textarea></td><td></td></tr>";
newHTML += "<tr><td></td><td align='right'><input type='button' value='Cancel' onClick=\"hidePopup('"+popupID+"')\"/><input type='button' id='addBM' name='addBM' value='Ok'/></td><td></td></tr>";
newHTML += "</table><br />";
}
else if(type == 'findBM'){

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

function moveToFront(){
	this.style.zIndex = z++;
}

function moveToFrontAgain(window){
	window.style.zIndex = z++;
}