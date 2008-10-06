function hideMessenger(){
	document.getElementById('mess1').style.display = "none";
	document.getElementById('mess2').style.display = "none";	
	document.getElementById('collapse1').style.display = "";
	document.getElementById('collapse2').style.display = "";
}

function showMessenger(){
	document.getElementById('mess1').style.display = "";
	document.getElementById('mess2').style.display = "";	
	document.getElementById('collapse1').style.display = "none";
	document.getElementById('collapse2').style.display = "none";
}

function showHideMessengerGroup(id){
	var group = document.getElementById(id);
	if(group.style.display == "none"){
		group.style.display = "";
	}
	else{
		group.style.display = "none";
	}
}

function changeMessengerArrow(id){
	var img = document.getElementById(id);
	var oldSrc = img.src;
	
	if(oldSrc.indexOf("arrow.gif") == -1){
		img.src = "images/arrow.gif";
	}
	else{
		img.src = "images/arrow-down.gif";
	}
}