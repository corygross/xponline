var uploadFrame = null;
function checkUploadComplete(triesLeft){
	if(uploadFrame == null){
		uploadFrame = document.getElementById("uploadIframe");
	}

	if(uploadFrame.contentWindow.document.body.innerHTML == "" && triesLeft > 0){
		setTimeout('checkUploadComplete('+(triesLeft-1)+')',1000)
	}
	else{
		var docArr = uploadFrame.contentWindow.document.body.innerHTML.split("^5&amp;");
		if(docArr[0] != "success"){
			alert("There may have been a problem uploading your document.");
			uploadFrame.contentWindow.document.body.innerHTML = "";
		}
		else{
			openDocument(docArr[1], docArr[2]);
			uploadFrame.contentWindow.document.body.innerHTML = "";
		}
	}	
}

function getAccessibleDocs(){
	new Ajax.Request('./handlers/accessibleDocs.php?', {
		method:'get',
		onSuccess: function(transport) {	
			$('openDocContainer').innerHTML = transport.responseText;
		},		
		onFailure: function()
		{
			alert("There was a problem getting your accessible documents.");
		}		
	});
}

function getWritableDocs(){
	new Ajax.Request('./handlers/writableDocs.php?', {
		method:'get',
		onSuccess: function(transport) {	
			$('accessDocContainer').innerHTML = transport.responseText;
		},		
		onFailure: function()
		{
			alert("There was a problem getting the document list.");
		}		
	});
}

function grantAccess(){
	if(userID == ""){
		alert("Please select a user.");
		return;
	}
	var list = document.getElementById('writableList');
	var docID = list.value;	
	if(docID == ""){
		alert("Please select a document to grant access to.");
		return;
	}
	var aLvl = "";
	if(document.grantForm.aLevel[0].checked){
		aLvl = document.grantForm.aLevel[0].value;
	}
	else if(document.grantForm.aLevel[1].checked){
		aLvl = document.grantForm.aLevel[1].value;
	}
	else if(document.grantForm.aLevel[2].checked){
		aLvl = document.grantForm.aLevel[2].value;
	}
	else{
		alert("Please select an access level.");
		return;
	}

	new Ajax.Request('./handlers/giveAccess.php?user='+userID+'&docID='+docID+'&aLvl='+aLvl, {
		method:'get',
		onSuccess: function(transport) {
			if(transport.responseText != "success"){
				alert(transport.responseText);
			}
		},		
		onFailure: function()
		{
			alert("There was a problem granting access.  Please try again.");
		}		
	});
	
	destroyPopup('grantAccess');
}

function newBlankDocument()
{
	var dName = document.getElementById('newDocName').value;
	if(dName == ""){
		alert('Please enter a name for the new document.');
		return;
	}
	
	new Ajax.Request('./documents/createBlankDoc.php?docName=' + dName, {
		method:'get',
		onSuccess: function(transport) {
			var responseArr = transport.responseText.split("^5&");
			if(responseArr[0] != "success"){
				alert(transport.responseText);
			}
			else{
				openDocument(responseArr[1],responseArr[2]);
			}
		},		
		onFailure: function()
		{
			alert("There was a problem creating '"+dName+",' please try again.");
		}		
	});
	
	destroyPopup('new_blank');
}

function openDocument(dID, dName)
{
	changeDocTitle(dName);
	
	//get the document from the server and display it!!!
	new Ajax.Request('./handlers/getDocumentContents.php?dID=' + dID, {
		method:'get',
		onSuccess: function(transport) {
			if(transport.responseText == "fail"){
				alert('There was a problem opening the document.  Please try again.');
			}
			else{
				loadNewDoc(transport.responseText);
			}
		},		
		onFailure: function()
		{
			alert("There was a problem opening the document.  Please try again.");
		}		
	});
}

function selectDocument(id, window)
{
	var list = document.getElementById(id);
	var docID = list.value;	
	if(docID == ""){
		alert("Please select a document to open.");
		return;
	}
	var docName = list.options[list.selectedIndex].text;
	destroyPopup(window);
	openDocument(docID, docName);
}

var userID = "";
var userName = "";
function selectUser(id, name){
	userID = id;
	userName = name;
}

function submitUpload(){
	setTimeout('checkUploadComplete(20)',1000)
	hidePopup('upload');
}