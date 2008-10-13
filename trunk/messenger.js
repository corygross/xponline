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
		groupStates[id] = "";
	}
	else{
		group.style.display = "none";
		groupStates[id] = "none";
	}
}

function changeMessengerArrow(id){
	var img = document.getElementById(id);
	var oldSrc = img.src;
	
	if(oldSrc.indexOf("arrow.gif") == -1){
		img.src = "images/arrow.gif";
		groupStates[id] = "images/arrow.gif";
	}
	else{
		img.src = "images/arrow-down.gif";	
		groupStates[id] = "images/arrow-down.gif";
	}
}

var groupStates = new Array();
function fixGroupStates(){
	for (var key in groupStates) {
		var group = document.getElementById(key);
		if(group != null){
			if(key == "online" || key == "offline"){
				group.style.display = groupStates[key];
			}
			else if(key == "online_arrow" || key == "offline_arrow"){
				group.src = groupStates[key];
			}
			else{
				alert('class not found');
			}
			item.className = currentHilites[key];
		}
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

function checkEnter(e, toID){
	e=e?e:window.event;
	if(e.keyCode==13){
		sendMessage(toID);
	}
}

function sendMessage(toID){
	var userID = toID.split("chat");
	var recBox = document.getElementById('rec'+toID);
	var sendBox = document.getElementById('send'+toID);
	var textToSend = sendBox.value;
	recBox.value += "Me" + ":\n" + textToSend;
	recBox.scrollTop = recBox.scrollHeight;
	sendBox.value = "";
	
	new Ajax.Request('./handlers/sendMessage.php?sendToID=' + userID[1] + "&message=" + textToSend, {
		method:'get',
		onSuccess: function(transport) {			
			if(transport.responseText != "success"){
				alert("There was a problem sending '"+message+".'");
			}
		},		
		onFailure: function()
		{
			alert("There was a problem sending '"+message+".'");
		}		
	});
}

function receiveNewMessage(fromID, fromName, message){
	var chatID = "chat" + fromID;
	if(windowExists(chatID)==false){
		openChat(fromID, fromName);
		hiliteContact(fromID,"viewed");
	}
	else{
		if(windowIsVisible(chatID)==true){
			hiliteContact(fromID,"viewed");
		}
		else{
			hiliteContact(fromID,"new");
		}
	}
	
	var recBox = document.getElementById('rec'+chatID);
	var splitName = fromName.split(" ");
	recBox.value += splitName[0] + ":\n" + message + "\n";
	//this needs to be done when the chat window is opened too
	recBox.scrollTop = recBox.scrollHeight;
}

var currentHilites = new Array();
function hiliteContact(fromID,type){
	var listID = 'contactItem'+fromID;
	var contactItem = document.getElementById(listID);
	if(type == "none"){
		contactItem.className = "contact";
		currentHilites[listID] = "contact";
	}
	else if(type == "viewed"){
		contactItem.className = "contact_old_msg";
		currentHilites[listID] = "contact_old_msg";
	}
	else if(type == "new"){
		contactItem.className = "contact_new_msg";
		currentHilites[listID] = "contact_new_msg";
	}
}

function fixHilites(){
	//cycle through the list of highlighted items and rehighlight them.  They were reloaded due to a contact list update.
	for (var key in currentHilites) {
		var item = document.getElementById(key);
		if(item != null){
			item.className = currentHilites[key];
		}
	}
}

function openChat(id, name){
	openPopup('chat'+id, 'Chat with '+name, 'chat');
	if(document.getElementById('contactItem'+id).className == "contact_new_msg"){
		hiliteContact(id,"viewed");
	}
}

function getPendingContacts(){
	new Ajax.Request('./handlers/pendingContacts.php?', {
		method:'get',
		onSuccess: function(transport) {	
			$(pendingContainer).innerHTML = transport.responseText;
		},		
		onFailure: function()
		{
			alert("There was a problem getting your pending contacts.");
		}		
	});
}

function confirmContacts(cbGroup){	
	var selectedUsers = "";
	if(cbGroup.length == undefined){
		if(cbGroup.checked == true){
			selectedUsers += cbGroup.value + ",";			
		}
	}
	else{
		for (i = 0; i < cbGroup.length; i++){
			if(cbGroup[i].checked == true){
				selectedUsers += cbGroup[i].value + ",";
			}
		}
	}
	if(selectedUsers != ""){
		new Ajax.Request('./handlers/confirmContacts.php?usersToConfirm=' + selectedUsers, {
			method:'get',
			onSuccess: function(transport)
			{
				//alert(transport.responseText);
				//maybe update their contact list now? probably not.  it will be updated in less than 30 seconds anyway.
			},
			onFailure: function()
			{
				alert("There was a problem confirming your contacts.");
			}		
		});
	}
	hidePopup('confirmContact');
}


//This will update the contact list
function initContactUpdate(){
new Ajax.PeriodicalUpdater({ success: 'contactList' }, './handlers/updateContactList.php',
  {
    method: 'get',
    frequency: 30,
	onSuccess:function(transport)
	{
		//wait for the list to be updated, then fix the highlighting
		setTimeout("fixHilites();",7);
		setTimeout("fixGroupStates();",7);
	}
  });
 }
 
 //This will update the contact list
function initPendingContactsUpdate(){
new Ajax.PeriodicalUpdater({ success: 'pendingButton' }, './handlers/updatePendingContactsButton.php',
  {
    method: 'get',
    frequency: 30
  });
 }
 
 
 
 initContactUpdate();
initPendingContactsUpdate();

//Create the Comet "object"
var Comet = Class.create();

//Set the properties and methods of the class
Comet.prototype = {
	url:'./server2.php',
	noerror:true,
	initialize: function(){},
	
	//Define the connection function
	connect:function()
		{
			//Create the AJAX object that inititiate the ajax connection
			this.ajax = new Ajax.Request(this.url, 
				{
					method:'get',
					//On a successful response 
					onSuccess:function(transport)
					{		
						if(transport.responseText != ""){
							//alert(transport.responseText);
							var response_arr = transport.responseText.split("&^*");
							receiveNewMessage(response_arr[0],response_arr[1],response_arr[2]);
						}
					},
				
					//When the request is completed
					onComplete:function()
					{
						//Immediately reconnect
						this.comet.connect();  //Connect immeidietly after disconnect (e.g. long polling!)
					},
					onInteractive:function(transport)
					{
						//var elements = Form.getElements('theForm');
						//elements[0].value = "";
						//elements[0].value = transport.responseText;
					},
					//If there is an error along the way
					onError:function()
					{
						alert("Error");
					}
				}
			);
			this.ajax.comet=this;
		
		},
		handleResponse: function(response)
		{
		  //$('content').innerHTML += '<div>' + response['msg'] + '</div>';
		}
	}
			
//				alert("Create the comet instance");
  var comet = new Comet();
//			alert("Call the connect method");
comet.connect();