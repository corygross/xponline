// USER INPUT-SPECIFIC GLOBALS

/* MOUSE/CURSOR RELATED */
var cursorColumn;
var cursorLine;
var mouseX;
var mouseY;
var selectionAnchorColumn;
var selectionAnchorLine;

/* KEYBOARD-RELATED */
const BACKSPACEKEY = 8;	const TABKEY = 9;			const ENTERKEY = 13;
const CAPSLOCKKEY = 20;	const ESCAPEKEY = 27;		const DELETEKEY = 46;
const SPACEKEY = 32;	const PAGEUPKEY = 33;		const PAGEDOWNKEY = 34;
const ENDKEY = 35;		const HOMEKEY = 36;			const LEFTARROWKEY = 37;
const UPARROWKEY = 38;	const RIGHTARROWKEY = 39;	const DOWNARROWKEY = 40;
const INSERTKEY = 45;	const SHIFTKEY = 16;

/* CONSTANTS: INPUT MODES */
const INSERT = 0;
const OVERWRITE = 1;

// "Booleans" to keep track of what modes we are in
var isSelectMode;
var isInsertMode;



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
		curcol = paramDocument.getLineLength( paramDocument.getDocumentLength() );
	}
	// If the calculated cursor is beyond the first or last character in a line, 
	// then set the cursor to the first or last character, respectively
	else {		
		if ( curcol < 0 ) curcol = 0;
		if ( curcol > paramDocument.getLineLength(currow) ) curcol = paramDocument.getLineLength(currow);
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
function getSelectedText(paramDocument) {
	return paramDocument.getTextInRange(selectionAnchorLine, selectionAnchorColumn, cursorLine, cursorColumn);
}
// If selection mode is not 'on', this function sets it 'on' and sets the selectionAnchor to given position (if given; otherwise current cursor position)
// If selection mode is already on, this method does nothing
// TODO / FIXME:  Really should check the legality of the given parameters.  Maybe make a function just for this purpose, since this problem comes up often
function setSelectMode(paramLine, paramColumn) {
	if ( !isSelectMode ) {
		if (paramLine == null) paramLine = cursorLine;
		if (paramColumn == null) paramColumn = cursorColumn;
		selectionAnchorLine = paramLine;
		selectionAnchorColumn = paramColumn;
		isSelectMode = true;
	}
	else return false;
}
// This function sets selection mode 'off'.
function resetSelectMode() {
	isSelectMode = false;
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