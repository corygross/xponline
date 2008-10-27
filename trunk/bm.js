// This function adds a bookmark to the document
// TODO: add bookmark into the doc
function addBM(windowID){
	var text = document.getElementById('bmText').value;
	var newBM = get_bm_value() + ": " + text;
	//XPODoc.insertLine(getCursorLine(), newBM);	
	alert(newBM);
	hidePopup(windowID);
}

// This function searches through the document and returns an array with all of the bookmarks in it
Array.prototype.findAllBookmarks = function() {
	var returnArray = new Array();
	
	var regEx1 = new RegExp("TODO:", "gi");
	var regEx2 = new RegExp("HACK:", "gi");
	var regEx3 = new RegExp("FIXME:", "gi");
	
	for (i=0; i<this.length; i++) {
		if(regEx1.test(this[i].text)){
			returnArray.push(new bookmarkResult(i, this[i].text));
		}
		if(regEx2.test(this[i].text)){
			returnArray.push(new bookmarkResult(i, this[i].text));
		}
		if(regEx3.test(this[i].text)){
			returnArray.push(new bookmarkResult(i, this[i].text));
		}
    }
	return returnArray;
}

/////////////////////////////////////////////////////
///////////////// bookmarkResult object ////////////////
function bookmarkResult(paramLineID, paramLineText)
{
	this.lineID = paramLineID;
	this.lineText = paramLineText;
}

// The function gets the selected bookmark type ie TODO, FIXME...
function get_bm_value()
{
	for (var i=0; i < document.addBMForm.bmType.length; i++)
	{
		if (document.addBMForm.bmType[i].checked)
		{
			return document.addBMForm.bmType[i].value;
		}
	}
}

// This function goes to the bookmark that was selected
function goToBM(windowID){
	if( gotoLineNum != -1){
		gotoLine(gotoLineNum);
		destroyPopup(windowID);
	}
	else{
		alert('Please select a bookmark!');
	}
}

// This function is called when a user selects a bookmark.
var selectedBM = null;
var gotoLineNum = -1;
function selectBM(obj, line){
	if(selectedBM != null){
		selectedBM.className = "bm";
	}
	obj.className = "bm_selected";	
	selectedBM = obj;
	gotoLineNum = line;
}