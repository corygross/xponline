<input type="button" value="Open a new window" onclick="makeNewPopup()"/>

<script language=javascript>

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

var windowCount = 0;
var lastNewTop = 0;
var lastNewLeft = 100;
function makeNewPopup(){
var popupID = "mypopup" + windowCount;
windowCount++;

if(lastNewTop == 0 || lastNewTop > 250){
	lastNewTop = 100;
}
else{
	lastNewTop += 15;	
}
lastNewLeft += 15;

var newHTML = "";
newHTML += "<div  align='center' style='background: blue;' onmousedown=\"grab('" + popupID + "', event);\">&nbsp;Click to drag</div>";
newHTML += "<textarea style='width: 100%;' rows='12' readonly='readonly'>" + popupID + "</textarea>";
newHTML += "<br/>";
newHTML += "<textarea style='width:100%;' rows='4'></textarea>";

var newElm = document.createElement("div");
newElm.setAttribute('id',popupID);
newElm.setAttribute('name',popupID);
newElm.setAttribute("style","position: absolute; width: 300px; height: 350px; display: none; background: white; border: 5px solid #005599;top:"+lastNewTop+"px;left:"+lastNewLeft+"px;");
newElm.onmousedown = moveToFront;

//an IE fix
var ua = navigator.userAgent.toLowerCase();
if((ua.indexOf("msie") != -1)){
newElm.style.setAttribute("cssText","position: absolute; width: 300px; height: 350px; display: none; background: white; border: 5px solid #005599;top:"+lastNewTop+"px;left:"+lastNewLeft+"px;",0);
}

newElm.innerHTML = newHTML;

document.body.appendChild(newElm);

makePopupVisible(popupID);
}

function makePopupVisible(id) {
  document.getElementById(id).style.display = "block";
}

function hidePopup(id){
	document.getElementById(id).style.display="none";
}

function moveToFront(){
	this.style.zIndex = z++;
}

</script>