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

var contactID = "";
var contactName = "";
function selectContact(id, name){
	contactID = id;
	contactName = name;
	if(contactID == ""){
		document.getElementById('btnAddContact').disabled = true;
	}
	else{
		document.getElementById('btnAddContact').disabled = false;
	}
}

function addContact(){
	if(contactID == ""){
		alert('Please select a contact to add.');
		return;
	}	
	if(contactName != document.getElementById('search-q').value){
		alert("Contact '" + document.getElementById('search-q').value + "' not found.  Please try again.");
		return;
	}
	
	new Ajax.Request('./handlers/addContact.php?userToAdd=' + contactID, {
		method:'get',
		onSuccess: function(transport) {			
			if(transport.responseText == "success"){
				alert('A contact request has been sent to user.');
				destroyPopup('addContact');
			}
			else{
				alert('There was a problem adding the contact.  Please try again.');
			}
		},		
		onFailure: function()
		{
			alert("Network error, please try again.");
		}		
	});
	
}