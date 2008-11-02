// USER INPUT-SPECIFIC GLOBALS

/* MOUSE/CURSOR RELATED */
var cursorColumn;
var cursorLine;
var mouseX;
var mouseY;
var selectionAnchorColumn;
var selectionAnchorLine;

/* KEYBOARD-RELATED */
var BACKSPACEKEY = 8;	var TABKEY = 9;
var ENTERKEY = 13;		var CAPSLOCKKEY = 20;
var DELETEKEY = 46;		var SPACEKEY = 32;
var PAGEUPKEY = 33;		var PAGEDOWNKEY = 34;
var ENDKEY = 35;		var HOMEKEY = 36;
var LEFTARROWKEY = 37;	var UPARROWKEY = 38;
var RIGHTARROWKEY = 39;	var DOWNARROWKEY = 40;
var INSERTKEY = 45;		var SHIFTKEY = 16;

// Input modes
var INSERT = 0;
var OVERWRITE = 1;



/***********************************************/
/********** MOUSE RELATED FUNCTIONS ********/

function setMouseCoords(paramX, paramY) {
	mouseX = paramX;
	mouseY = paramY;
}
function getMouseCoords() {
	return [mouseX, mouseY];
}
function getMouseX() {
	return mouseX;
}
function getMouseY() {
	return mouseY;
}



/***********************************************/
/********** CURSOR RELATED FUNCTIONS ********/

// This function calculates the position of the cursor  for the given document
// based on the given parameters representing mouseX and mouseY, and
function deriveCursorForDocument(paramMouseX, paramMouseY, paramDocument) {

	// Calculate line and column number based on mouse position
	var currow = Math.floor((mouseY - PADDING_TOP)/FONT_HEIGHT);
	var curcol = Math.floor((mouseX - PADDING_LEFT)/FONT_WIDTH);
	
	// Perform sanity check on calculated values:
	// If the calculated line is below the last line, then set cursor at last character in document
	if (currow > paramDocument.getDocumentLength()-1) {
		currow = paramDocument.getDocumentLength()-1;
		curcol = paramDocument.getLineLength( paramDocument.getDocumentLength()-1 );
	}
	// If the calculated cursor is beyond the first or last character in a line, 
	// then set the cursor to the first or last character, respectively
	else {		
		if ( curcol < 0 ) curcol = 0;
		if ( curcol >= paramDocument.getLineLength(currow) ) curcol = paramDocument.getLineLength(currow)-1;
	}
	
	// Loop through the locked lines and make sure we aren't trying to move to it.
	for(var l=0; l < lockedLines.length; l++ )
	{
		if(lockedLines[l] == currow){
			alert("Another user is currently on that line, and it is locked.");
			return;
		}
	}
	
	// Store the calculated values
	setCursor(currow,curcol);
}

// These functions are self-explanatory again
function getCursor() {
	return [cursorLine,cursorColumn];
}
function getCursorColumn() {
	return cursorColumn;
}
function getCursorLine() {
	return cursorLine;
}
function setCursor(paramLine, paramColumn) {
	cursorLine = paramLine;
	cursorColumn = paramColumn;
}



/**************************************************/
/******** SELECTION RELATED FUNCTIONS *********/

// These functions returns the position of the selection anchor
function getSelectionAnchor() {
	return [selectionAnchorLine, selectionAnchorColumn];
}
function getSelectionAnchorLine() {
	return selectionAnchorLine;
}
function getSelectionAnchorColumn() {
	return selectionAnchorColumn;
}
// This function sets selection mode 'on', and furthermore sets the 
// selectionAnchor position to the current cursor position
function setSelection() {
	selectionAnchorLine = cursorLine;
	selectionAnchorColumn = cursorColumn;
	isSelection = true;
}
// This function sets selection mode 'off'.
function resetSelection() {
	isSelection = false;
}



/****************************************************/
/********** INPUT MODE RELATED FUNCTIONS ********/

// This function toggles the InsertMode flag (representing Insert or Overwrite)
function toggleInputMode() {
	if ( isInsertMode ) isInsertMode = false;
	else isInsertMode = true;
}
// This explicitly sets whether Insert Mode or Overwrite Mode is active
function setInputMode( paramMODE ) {
	isInsertMode = paramMODE;
}



/************************************************************/
/********** TEXT MODIFICATION RELATED FUNCTIONS ********/

/* NOTE: THE typeSpecial FUNCTION IS LOCATED IN THE MAIN editor.html FILE */

// This function is responsible for analyzing a keyPressEvent and subsequently
// executing the appropriate function, based on the charCode
function type( paramEvent ) {
	// This needs a lot of cleanup...
	var evt;
	if(isFF == true){
		if ( paramEvent.charCode != 0 ) typeCharacter( paramEvent.charCode );
		else typeSpecial( paramEvent.keyCode );
		return;
	}
	else if(isIE == true){
		evt = myIFrame.window.event;
	}
	else if(isChrome == true || isSafari == true){
		evt = paramEvent;
	}
	else{
		alert('an unknown browser... editing may not work.');
	}
	
	// No browses besides FF are kind enough to have a charCode property...  We have to find out ourselves which character to display
	var key = evt.keyCode;
	if((key >= 48 && key <= 126) || (key >= 186 && key <= 192) || (key >= 219 && key <= 222)){
		var charCode = getCharCode(key, evt.shiftKey);		
		if(charCode != null) typeCharacter(charCode);
	}
	else{
		typeSpecial( key );
	}

	//if ( key != 0 ) typeCharacter( key );
	//else typeSpecial( key );	
}

// This function is responsible for text input
function typeCharacter( paramCharCode ) {	
	var tempCurrentLine = new Array();
	tempCurrentLine.push(XPODoc.getLineText(cursorLine).substring(0,cursorColumn));
	tempCurrentLine.push(XPODoc.getLineText(cursorLine).substr(cursorColumn, 1));
	tempCurrentLine.push(XPODoc.getLineText(cursorLine).substring(cursorColumn+1));

	// Insert character
	tempCurrentLine[1]=String.fromCharCode(paramCharCode) + tempCurrentLine[1];
	
	// Update cursor
	cursorColumn++;
	
	// Commit changes
	XPODoc.setLineText( cursorLine, tempCurrentLine.join("") );
}