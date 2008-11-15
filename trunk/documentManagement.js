var uploadFrame = null;
var languageFlag = "text"; //For syntax highlighting

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
	
	showLoadingIndicator();
	
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
	// Show the loading indicator
	showLoadingIndicator();
	
	//get the document from the server and display it!!!
	new Ajax.Request('./handlers/getDocumentContents.php?dID=' + dID, {
		method:'get',
		onSuccess: function(transport) {
			hideLoadingIndicator();
			if(transport.responseText == "fail"){
				alert('There was a problem opening the document.  Please try again.');
			}
			else{
				var docInfoArr = transport.responseText.split("&^*");
				if(docInfoArr[0] == "r") dName = dName + " (Readonly)";
				changeDocTitle(dName);
				setSyntaxFlag(dName); //Set the syntax highlighting flag
				loadNewDoc(dID, docInfoArr[1], docInfoArr[0]);
			}
		},		
		onFailure: function()
		{
			alert("There was a problem opening the document.  Please try again.");
		}		
	});
}

/*
 * Functions: setSyntaxFlag
 *
 * Purpose: Identify what type of file
 * 			is being opened for syntax
 *			highlighting purposes. 
 *
 * Input:  fileName - the name of the file being opened
 * Output: None
 *
 * Preconditions: The function assumes that there is at least one
 *				  character after the dot in the fileName
 *
 * Postconditons: None
 *
 */
function setSyntaxFlag(filename)
{
//	alert("The filename is " + filename);
	var pos = filename.indexOf(".");
	var extension = filename.substring(pos+1);
//	alert("The file extension is " + extension);
	
	//Determine which flag to set
	setCurrentLanguage(extension);
}
/*
 * Function: setCurrentLanguage
 *
 * Purpose: Set the language variable
 *			for identifing what type of
 *			file is currently being 
 *			displayed.
 *
 *
 * Input: extension - the currently displayed
 *					  file's extension.
 *
 * Output: None
 *
 */
function setCurrentLanguage(extension)
{
	//Parse out those weird characters that can appear
	//at the end of an uploaded filename
	extension = extension.replace("^5", "");
	
	if(extension == "java"){languageFlag = "java";}
	else
	languageFlag = extension;
}

/*
 * Function: getCurrentLanguage
 *
 * Purpose: Return the value of the language
 *			variable.
 *
 * Input: None
 * Output The value of the language variable. 
 *
 * Preconditions: None
 * Postconditions: None
 *
 */
function getCurrentLanguage(){ return languageFlag; }

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

var leftEdge = -1;
var	topEdge = -1;
function showLoadingIndicator()
{
	if(leftEdge == -1){
		leftEdge = (screen.width/2) - 16;
		topEdge = (getHeight()/2) - 16;
	}
	var loadingIMG = document.getElementById("loadingIndicator");

	if(isIE){
		loadingIMG.style.top = topEdge;
		loadingIMG.style.left = leftEdge;
		loadingIMG.style.display = "block";	
	}
	else{
		// For browsers other than IE
		loadingIMG.setAttribute("style","position: absolute; display: block; top:"+topEdge+"px;left:"+leftEdge+"px;");
	}
}

function hideLoadingIndicator()
{
	document.getElementById("loadingIndicator").style.display="none";
}

function submitUpload(){
	showLoadingIndicator();
	setTimeout('checkUploadComplete(20)',1000)
	hidePopup('upload');
}