// This function searches the array of lines and returns an array of all matches
Array.prototype.findAllMatches = function(searchStr, matchCase) {
	var returnArray = new Array();
	
	var regEx;
	if(matchCase) regEx = new RegExp(searchStr, "g");
	else regEx = new RegExp(searchStr, "gi");
	
	for (i=0; i<this.length; i++) {
		while(regEx.test(this[i].text)){
			returnArray.push(new result(i, regEx.lastIndex - searchStr.length, regEx.lastIndex - 1));
		}
    }
	if(returnArray.length == 0){
		return false;
	}
	return returnArray;
}

// This function finds the next match after the cursor position
Array.prototype.findNext = function(searchStr, matchCase) {
	var curLine = getCursorLine();
	var curCol = getCursorColumn();
	
	var regEx;
	if(matchCase) regEx = new RegExp(searchStr, "g");
	else regEx = new RegExp(searchStr, "gi");
	
	var lineText;	
	for (i=curLine; i<this.length; i++) {	
		lineText = this[i].text;
		if(i == curLine){			
			lineText = lineText.substring(curCol+1);
			if(regEx.test(lineText)){
				return new result(i, regEx.lastIndex + curCol - searchStr.length + 1, regEx.lastIndex + curCol);
			}
		}
		else{
			if(regEx.test(lineText)){
				return new result(i, regEx.lastIndex - searchStr.length, regEx.lastIndex - 1);
			}
		}
    }
    return false;
}

// This function finds the previous match
Array.prototype.findPrev = function(searchStr, matchCase) {
	var foundIndex;
	var curLine = getCursorLine();
	var curCol = getCursorColumn();
	
	var regEx;
	if(matchCase) regEx = new RegExp(searchStr, "g");
	else regEx = new RegExp(searchStr, "gi");
	
	for (i=curLine; i>=0; i--) {
		if(i == curLine){
			while(regEx.test(this[i].text) && regEx.lastIndex <= curCol){
				foundIndex = regEx.lastIndex - 1;
			}				
		}
		else{
			while(regEx.test(this[i].text)){
				foundIndex = regEx.lastIndex - 1;
			}				
		}
		if(foundIndex != null) return new result(i, foundIndex - searchStr.length + 1, foundIndex);		
    }
    return false;
}

// This function takes the line number from the goto line popup window and goes to it
function gotoLineGo()
{
	var lineNum = document.getElementById('gotoLineInput').value;
	if(lineNum == ""){
		alert('Please enter a line number');
		return;
	}
	var IsNum = /^-?\d+$/.test(lineNum);
	if(IsNum == false){
		alert('Please only enter numbers');
		return;
	}
	gotoLine(lineNum);
	hidePopup('goto_window');
}

/////////////////////////////////////////////////////
///////////////////// result object ////////////////////
function result(paramLineID, paramStartIndex, paramEndIndex)
{
	this.lineID = paramLineID;
	this.startIndex = paramStartIndex;
	this.endIndex = paramEndIndex;
}

///////////////////////////////////////////////////////////
////////////////////////// findAll //////////////////////////
// returns false if none found, otherwise returns an array of results
function findAll(){
	var text = document.getElementById('textToFind').value;
	if(text == ""){
		alert("Please enter something to search for!");
		return;
	}
	return XPODoc.document.findAllMatches(text, document.findForm.findMatchCase.checked);
}

// This function is called by the Find window when the user clicks Find Next
function findText(){
	var text = document.getElementById('textToFind').value;
	if(text == ""){
		alert("Please enter something to search for!");
		return;
	}
	
	var matchCase = document.findForm.findMatchCase.checked;
	
	var result;
	if(document.findForm.findType[0].checked){ // Search up
		result = XPODoc.document.findPrev(text, matchCase);
	}
	else if(document.findForm.findType[1].checked){ // Search down
		result = XPODoc.document.findNext(text, matchCase);
	}	
	
	if(result != false){
		gotoPosition(result.lineID, result.startIndex);
	}
	else{
		alert("Reached the end of the document.");
	}
}