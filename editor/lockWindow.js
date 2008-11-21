// The id of any lock popup that is open.  We need to keep track of this
// to be able to hide it if new locks arrive while the user is hovering over the lock
var currentLockPopupID = null;

function makeNewLockPopup(event, popupID, userName)
{
	if(currentLockPopupID != null){ closeLockPopup();	}
	
	var location = captureMousePos(event);	
	var leftEdge = location[0] + 15;
	var topEdge = location[1] + 15;

	var newElm = document.createElement("div");
	newElm.setAttribute('id',popupID);
	newElm.setAttribute('name',popupID);
	newElm.setAttribute("style","top:"+topEdge+"px;left:"+leftEdge+"px;");
	newElm.setAttribute("class","lockWindow");

	//an IE fix
	var ua = navigator.userAgent.toLowerCase();
	if((ua.indexOf("msie") != -1)){
		newElm.style.setAttribute("cssText","top:"+topEdge+"px;left:"+leftEdge+"px;",0);
		newElm.className = "lockWindow";
	}
	
	newElm.innerHTML = userName;
	document.body.appendChild(newElm);
	currentLockPopupID = popupID;
}

function closeLockPopup()
{
	var pop = document.getElementById(currentLockPopupID);
	if(pop != null){
		pop.parentNode.removeChild(pop);
	}
}

function captureMousePos(e) {
	var posX;
	var	posY;
	if(document.all){
		e = window.event;
		posX = e.clientX + document.body.scrollLeft - 3;
        posY = e.clientY + document.body.scrollTop - 3;
	}
	else{
		posX = e.pageX;
		posY = e.pageY;
	}
	return [posX, posY];
}