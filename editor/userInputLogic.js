// USER INPUT-SPECIFIC GLOBALS

/* MOUSE/CURSOR RELATED */
var cursorColumn;
var cursorLine;
var mouseX;
var mouseY;
var selectionAnchorColumn;
var selectionAnchorLine;

/* KEYBOARD-RELATED */
// const is mozilla only!!!!  do NOT use it!!!!
var BACKSPACEKEY = 8;	var TABKEY = 9;			var ENTERKEY = 13;
var CAPSLOCKKEY = 20;	var ESCAPEKEY = 27;		var DELETEKEY = 46;
var SPACEKEY = 32;		var PAGEUPKEY = 33;		var PAGEDOWNKEY = 34;
var ENDKEY = 35;		var HOMEKEY = 36;		var LEFTARROWKEY = 37;
var UPARROWKEY = 38;	var RIGHTARROWKEY = 39;	var DOWNARROWKEY = 40;
var INSERTKEY = 45;		var SHIFTKEY = 16;		var HIDECHATWINDOWSKEY = 77;
var LEFTBRACKET = 219;	var LEFTPAREN = 57;		var FINDKEY = 70;
var GOTOKEY = 71;		var SELECTALLKEY = 65;	var REPLACEKEY = 82;
var CUTKEY = 88;		var COPYKEY = 67;		var PASTEKEY = 86;
var NEWKEY = 78;		var OPENKEY = 79;		var UPLOADKEY = 85;
var COLORKEY = 83;		var HIGHLIGHTKEY = 72;

/* CONSTANTS: INPUT MODES */
var INSERT = 0;
var OVERWRITE = 1;

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
	
	// Before we move the cursor there, make sure that the line isn't locked
	if( paramDocument.getLineLockingUser( currow ) != null ){
		alert("Another user is currently on line "+currow+", and it is locked.");
		return;
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
function setCursorCoords( paramCoordinates ) {
	// Ensure we are being given correct type of input
	if ( paramCoordinates.join ) {
		cursorLine = paramCoordinates[0];
		cursorColumn = paramCoordinates[1];
	} else return false;
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
function setSelectMode(paramDocument, paramLine, paramColumn) {
	if ( !isSelectMode ) {
		if (paramLine == null) paramLine = cursorLine;
		if (paramColumn == null) paramColumn = cursorColumn;
		// kinda hackish
		var returnValue = paramDocument.setCurrentSelection( paramLine, paramColumn, paramLine, paramColumn );
		if ( returnValue ) isSelectMode = true;
	}
	else return false;
}
// This function sets selection mode 'off'.
function resetSelectMode( paramDocument ) {
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

// This function is responsible for text input
function typeCharacter( paramDoc, paramCharCode ) {	
	// Local variable to extract information about cursor after operations
	var newCursorCoords;
	// Determine if we typing normally, or overwriting a selected block, and act accordingly
	if ( paramDoc.isSelection ) {
		var tmpSel = paramDoc.getCurrentSelection();
		var newCursorCoords = paramDoc.replaceTextInRange( tmpSel.startLine, tmpSel.startColumn, tmpSel.endLine, tmpSel.endColumn, String.fromCharCode(paramCharCode) );
	}
	else newCursorCoords = paramDoc.insertText( String.fromCharCode(paramCharCode), cursorLine, cursorColumn );
	
	cursorColumn = newCursorCoords[1];
	//var tempCurrentLine = new Array();
	//tempCurrentLine.push(paramDoc.getLineText(cursorLine).substring(0,cursorColumn));
	//tempCurrentLine.push(paramDoc.getLineText(cursorLine).substr(cursorColumn, 1));
	//tempCurrentLine.push(paramDoc.getLineText(cursorLine).substring(cursorColumn+1));

	// Insert character
	//tempCurrentLine[1]=String.fromCharCode(paramCharCode) + tempCurrentLine[1];
	
	// Update cursor
	//cursorColumn++;
	
	// Commit changes
	//paramDoc.setLineText( cursorLine, tempCurrentLine.join("") );
}

/* This function provides functionality to so-called "special keys".  Basically, any non-character related keyboard input. (kindof) */
function typeSpecial(paramDoc, paramKEYCODE, paramIsAlt, paramIsCtl, paramIsShift) {

	switch ( paramKEYCODE ) {
	
		case LEFTARROWKEY: 
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			// If we are at the first char of the first line do nothing
			// If we are at the first char of any other line, wrap to the last char of the previous line
			// Otherwise, simply move left
			if ( cursorColumn == 0 && cursorLine == 0 ) break;
			if ( cursorColumn == 0 ) {
				if ( paramDoc.getLineLockingUser( cursorLine-1 ) != null ) { 
					alert("Another user is currently on line "+(cursorLine-1)+", and it is locked.");
					break;
				}
				cursorLine--;
				cursorColumn = paramDoc.getLineLength(cursorLine);
			}
			else cursorColumn--;	
			break;
			
		case RIGHTARROWKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			// If we are at the last char of the last line, do nothing
			// If we are at the last char of any other line, wrap to the first char of the next line
			// Otherwise, simply move right
			if ( cursorColumn == paramDoc.getLineLength(cursorLine) && cursorLine == paramDoc.getDocumentLength()-1 ) break;
			if ( cursorColumn == paramDoc.getLineLength(cursorLine) ) {
				if ( paramDoc.getLineLockingUser( cursorLine+1 ) != null ) { 
					alert("Another user is currently on line "+(cursorLine+1)+", and it is locked.");
					break;
				}
				cursorLine++;
				cursorColumn = 0;
			}
			else cursorColumn++;
			break;
			
		case UPARROWKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			// If we are on the first line, move to first char of line.
			// If we are not on the first line, see if the line is locked and alert the user if it is
			// Otherwise, move up. If we end up out of range of the line, move to the last char of the line
			if ( cursorLine == 0 ) cursorColumn = 0;
			else if ( paramDoc.getLineLockingUser( cursorLine-1 ) != null ) alert("Another user is currently on line "+(cursorLine-1)+", and it is locked.");
			else if ( cursorColumn > paramDoc.getLineLength(--cursorLine) ) cursorColumn = paramDoc.getLineLength(cursorLine);
			break;
			
		case DOWNARROWKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );			
			
			// If we are on the last line, move to last char of line.
			// If we are not on the last line, see if the line is locked and alert the user if it is
			// Otherwise, move down. If we end up out of range of the line, move to the last char of the line
			if ( cursorLine == paramDoc.getDocumentLength()-1 ) cursorColumn = paramDoc.getLineLength(cursorLine);
			else if ( paramDoc.getLineLockingUser( cursorLine+1 ) != null ) alert("Another user is currently on line "+(cursorLine+1)+", and it is locked.");
			else if ( cursorColumn > paramDoc.getLineLength(++cursorLine) ) cursorColumn = paramDoc.getLineLength(cursorLine);
			break;
			
		case ENDKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			/* If we are holding CTL, then we want to go to the very last char of the document.  Otherwise, of just the current line */
			if ( paramIsCtl ) setCursor( paramDoc.getDocumentLength()-1, paramDoc.getLineLength( paramDoc.getDocumentLength()-1 ) );
			else cursorColumn = paramDoc.getLineLength(cursorLine);

			break;
			
		case HOMEKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			/* If we are holding CTL, then we want to go to the very first char of the document.  Otherwise, of just the current line */
			if ( paramIsCtl ) setCursor( 0, 0 );
			else cursorColumn = 0;
			
			break;
			
		case PAGEUPKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			/* If we are holding CTL, Notepadd++ and a variety of other programs perform no function in this case.  Do the same */
			if ( paramIsCtl ) break;
			
			// Move the cursor up a number of time relative to the current editing window's height			
			if(isIE == true){
				cursorLine -= Math.floor(guiDoc.body.clientHeight / FONT_HEIGHT);
			}
			else{
				cursorLine -= Math.floor(myIFrame.contentWindow.innerHeight / FONT_HEIGHT);
			}
			// Do out-of-bounds checks
			if ( cursorLine < 0 ) {
				cursorLine = 0;
				cursorColumn = 0;
			} else if ( cursorColumn >= paramDoc.getLineLength( cursorLine ) ) cursorColumn = paramDoc.getLineLength(cursorLine);
			// If the line is locked, move down one
			while ( paramDoc.getLineLockingUser( cursorLine ) != null ) { cursorLine++; }
			if(isIE == true){
				myIFrame.scrollBy(0,-guiDoc.body.clientHeight+PADDING_TOP);
			}
			else{
				myIFrame.contentWindow.scrollBy(0,-myIFrame.contentWindow.innerHeight+PADDING_TOP);
			}
			break;
					
		case PAGEDOWNKEY:
			/* If we are holding shift, moving the cursor actually selects text, so we need to ensure we are in select mode */
			if ( paramIsShift ) if ( !isSelectMode ) setSelectMode( paramDoc, cursorLine, cursorColumn );
			
			/* If we are holding CTL, Notepadd++ and a variety of other programs perform no function in this case.  Do the same */
			if ( paramIsCtl ) break;
			
			// Move the cursor down a number of times relative to the current editing window's height
			if(isIE == true){
				cursorLine += Math.floor(guiDoc.body.clientHeight / FONT_HEIGHT);
			}
			else{
				cursorLine += Math.floor(myIFrame.contentWindow.innerHeight / FONT_HEIGHT);
			}
			// Do out-of-bounds checks
			if ( cursorLine > paramDoc.getDocumentLength()-1 ) {
				cursorLine = paramDoc.getDocumentLength()-1;
				cursorColumn = paramDoc.getLineLength( cursorLine )-1;
				if( cursorColumn < 0 ) cursorColumn = 0;
			} else if ( cursorColumn >= paramDoc.getLineLength( cursorLine ) ) cursorColumn = paramDoc.getLineLength(cursorLine);
			// If the line is locked, move up one
			while ( paramDoc.getLineLockingUser( cursorLine ) != null ) { cursorLine--; }
			if(isIE == true){
				myIFrame.scrollBy(0,guiDoc.body.clientHeight-PADDING_TOP);
			}
			else{
				myIFrame.contentWindow.scrollBy(0,myIFrame.contentWindow.innerHeight-PADDING_TOP);
			}
			break;
			
		case BACKSPACEKEY:
			// If we are on the first char of the first line, do nothing.
			// If we are on the first char of any other line, backspace removes the "newline character"
			// -- which doesn't exist in our implementation.  We simulate this removal by merging lines.
			// Otherwise, we simply remove the previous char in the current line
			if ( cursorLine == 0 && cursorColumn == 0 ) break;
			if ( cursorColumn == 0 && paramDoc.getLineLockingUser( cursorLine-1 ) != null ) {
				alert("Another user is currently on line "+(cursorLine-1)+", and it is locked.");
			}
			else if ( cursorColumn == 0 ) {
				// Merge the two lines, and remove the original line
				cursorColumn = paramDoc.getLineLength( cursorLine-1 );	// Place cursor at end of prior line
				// Perform text merge into prior line
				paramDoc.setLineText( cursorLine-1, paramDoc.getLineText( cursorLine-1 ) + paramDoc.getLineText( cursorLine ) );
				// Remove the line from our data structure
				paramDoc.removeLine( cursorLine );
				// Decrement cursorLine
				cursorLine--;
			} else {
				// "Remove" the character prior to cursorColumn, and decrement cursorColumn
				var tempText = paramDoc.getLineText( cursorLine );
				paramDoc.setLineText( cursorLine, tempText.substring(0,cursorColumn-1) + tempText.substring(cursorColumn--) );
			}
			break;
			
		case DELETEKEY:
			// If we are at the last char of the last line, do nothing
			// If we are at the last char of any other line, we remove the 'newline character', thus merging the current line with the next line
			// Otherwise, we simply remove the char at the cursor position
			if ( cursorColumn == paramDoc.getLineLength( paramDoc.getDocumentLength()-1 )-1 && cursorLine == paramDoc.getDocumentLength()-1 ) break;
			if ( cursorColumn == paramDoc.getLineLength( cursorLine ) && paramDoc.getLineLockingUser( cursorLine+1 ) != null ) {
				alert("Another user is currently on line "+(cursorLine+1)+", and it is locked.");
			}
			else if ( cursorColumn == paramDoc.getLineLength( cursorLine ) ) {
				// Merge the next line into the current line
				paramDoc.setLineText( cursorLine, paramDoc.getLineText(cursorLine) + paramDoc.getLineText(cursorLine+1) );
				// Remove the line in question from our data structure
				paramDoc.removeLine( cursorLine+1 );
			} else {
				// "Remove" the character at the cursorColumn position
				var tempText = paramDoc.getLineText( cursorLine );
				paramDoc.setLineText( cursorLine, tempText.substring(0,cursorColumn) + tempText.substring(cursorColumn+1) );
			}
			break;
			
		case ENTERKEY:
			// When we press the enter key, we need to insert a new line into the document
			// We need to insert a new line following the current line, which contains the current line's text starting from the cursor
			paramDoc.insertLine( cursorLine+1, paramDoc.getLineText( cursorLine ).substring( cursorColumn ) );
			paramDoc.setLineText( cursorLine, paramDoc.getLineText( cursorLine ).substring( 0, cursorColumn ) );
			// Update the cursor
			cursorLine++;
			cursorColumn = 0;
			break;
			
		case TABKEY:
			// Insert 4 spaces at current cursor position
			//  SUPER HACK:  Need to redesign functions a bit to eliminate redundancy and make it cleaner and more readable.  
			// We eventually want this to call an "insertText()" function, but for now....
			typeCharacter( paramDoc, " ".charCodeAt(0) );
			typeCharacter( paramDoc, " ".charCodeAt(0) );
			typeCharacter( paramDoc, " ".charCodeAt(0) );
			typeCharacter( paramDoc, " ".charCodeAt(0) );
			break;
			
		case SHIFTKEY:
			break;
			
		case CAPSLOCKKEY:
			break;
			
		case HIDECHATWINDOWSKEY:
			if( paramIsCtl ) { hideChatShortcut(); }
			else{ return true; }
			break;
			
		//For autobracketing
		case LEFTBRACKET:
			if( !paramIsShift ) { return true; }
			if(isFF == true)
				{
					var origCursorCol = this.getCursorColumn();
					this.setCursor(this.getCursorLine(), origCursorCol+1);
					typeCharacter( paramDoc, "}".charCodeAt(0) );
					this.setCursor(this.getCursorLine(), origCursorCol);
				}
			else
			{
				var curChar = paramDoc.getLineText(cursorLine).substring(cursorColumn, cursorColumn+1);
				if(curChar != '{')
				{
					typeCharacter( paramDoc, "{".charCodeAt(0) );
					typeCharacter( paramDoc, "}".charCodeAt(0) );
					this.setCursor(this.getCursorLine(), this.getCursorColumn()-1);
				}
			}
			break;
		case LEFTPAREN:
			if( !paramIsShift ) { return true; }
			if(isFF == true)
				{
					var origCursorCol = this.getCursorColumn();
					this.setCursor(this.getCursorLine(), origCursorCol+1);
					typeCharacter( paramDoc, ")".charCodeAt(0) );
					this.setCursor(this.getCursorLine(), origCursorCol);
				}
			else
			{
				var curChar = paramDoc.getLineText(cursorLine).substring(cursorColumn, cursorColumn+1);
				if(curChar != '(')
				{
					typeCharacter( paramDoc, "(".charCodeAt(0) );
					typeCharacter( paramDoc, ")".charCodeAt(0) );
					this.setCursor(this.getCursorLine(), this.getCursorColumn()-1);
				}
			}
			break;
		case FINDKEY:
			if( paramIsCtl ) { findMenuClick(); }
			else{ return true; }
			break;
		case REPLACEKEY:
			if( paramIsCtl ) { replaceMenuClick(); }
			else{ return true; }
			break;
		case GOTOKEY:
			if( paramIsCtl ) { gotoMenuClick(); }
			else{ return true; }
			break;
		case SELECTALLKEY:
			if( paramIsCtl ) { selectAllMenuClick(); }
			else{ return true; }
			break;
		case CUTKEY:
			if( paramIsCtl ) { cutIconClicked(); }
			else{ return true; }
			break;
		case COPYKEY:
			if( paramIsCtl ) { copyIconClicked(); }
			else{ return true; }
			break;
		case PASTEKEY:
			if( paramIsCtl ) { pasteIconClicked(); }
			else{ return true; }
			break;
		case NEWKEY:
			if( paramIsCtl ) { newMenuClick(); }
			else{ return true; }
			break;
		case OPENKEY:
			if( paramIsCtl ) { openMenuClick(); }
			else{ return true; }
			break;
		case UPLOADKEY:
			if( paramIsCtl ) { uploadMenuClick(); }
			else{ return true; }
			break;
		case COLORKEY:
			if( paramIsCtl ) { colorMenuClick(); }
			else{ return true; }
			break;
		case HIGHLIGHTKEY:
			if( paramIsCtl ) { highlighMenuClick(); }
			else{ return true; }
			break;
		default:
			return true;		// Return  values are this way for the convenience of the onKeyDown event handler function
	}
	return false;	// Return  values are this way for the convenience of the onKeyDown event handler function
} // END typeSpecial(paramKEY)