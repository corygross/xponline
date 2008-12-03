// Data structure to hold unformatted document
function TextDocument( paramHTMLDocumentPane ) 
{
	//////////////////////////////////////////////////
	////////////// MEMBER VARIABLES ////////////////
	
	// Sub-data structure for each lineHandle,lineText pair
	this.line = function( paramDOMHandle, paramId, paramLineText )
	{
		this.id 	 = paramId;
		this.handle  = paramDOMHandle
		this.text 	 = paramLineText;
		this.updated = 1;			// 1=true
		this.indexed = false; 		//Lets us know if the line has already been indexed
		this.isLockedBy = null;
	}
	// Sub-data structure defining the bounds of a text block
	this.block = function( paramStartLine, paramStartColumn, paramEndLine, paramEndColumn )
	{
		this.startLine = paramStartLine;
		this.startColumn = paramStartColumn;
		this.endLine = paramEndLine;
		this.endColumn = paramEndColumn;
	}
	this.isSelection = false;	// This is to be a "boolean" which we use to keep track of whether we have a currentSelection
	this.currentSelection;		// This is to be a block, or null if nothing is selected
	this.document;				// This is to be an array of lines
	this.documentID;			//  Keep track of the document's unique ID
	this.documentName;
	this.documentExtension;
	
	this.htmlDocumentPane;		// This is a container for the Document-pane in our iFrame
	this.htmlDocumentContent;	// This is a container for the 'entireDocument' div in our iFrame's body
	
	this.uniqueNameCounter;		// This variable is used to provide unique id's to each line
	this.updateTracker;			// This will be an array of lines which need to be updated
	this.updateToServer;		// HACK: This whole system is kind of a hack
	
	this.renderer;				// This object will be this documents Renderer.  It determines how the text gets formatted, and is used
								// to perform all HTML formatting of text in the document
	
	////////////////////////////////////////////////////////
	////////////// TEXT-SPECIFIC FUNCTIONS ///////////////

	// This function adds a line to the end of the document
	this.appendLine = function( paramText ) {
		this.insertLine( this.getDocumentLength(), paramText );
	}
	
	//  Clears the contents of the document
	this.blankDocument = function() {
		this.htmlDocumentContent.innerHTML = "";
		this.clearCurrentSelection();
		this.document = new Array();
		this.appendLine("");				// This avoids null-related errors in several places
		this.uniqueNameCounter = 0;			// This variable is used to provide unique id's to each line
		this.documentID = "";
		this.updateToServer = false;
	}
	
	// Clears the current selection
	this.clearCurrentSelection = function() {
		this.isSelection = false;
		var tmpStart; var tmpFinish;
		if ( this.currentSelection.startLine < this.currentSelection.endLine ) {
			tmpStart = this.currentSelection.startLine;
			tmpFinish = this.currentSelection.endLine;
		} else {
			tmpStart = this.currentSelection.endLine;
			tmpFinish = this.currentSelection.startLine;
		}
		var tmpNumLines = tmpFinish - tmpStart;
		for (var i=0;i<=tmpNumLines;i++)
			this.setLineUpdated(tmpStart+i);
	}
	
	// Returns the length of the document in number of lines
	this.getDocumentLength = function() {
		return this.document.length;
	}
	
	// Returns the "line" object at the specified lineNum in the document
	this.getLineByLineNumber = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.document[paramLineNum];
	}
	
	// Returns the HTML DOM handle associated with the specified line
	this.getLineHandle = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.document[paramLineNum].handle;
	}
	
	// Returns the id of the specified line
	this.getLineId = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.document[paramLineNum].id;
	}
	
	// Returns the length of the specified line
	this.getLineLength = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.getLineText( paramLineNum ).length;
	}
	
	// Returns the user who is currently locking the line.  NOTE:  will return null if no user is locking the line
	this.getLineLockingUser = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.document[paramLineNum].isLockedBy;
	}
	
	// Returns the text of the specified line
	this.getLineText = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		return this.document[paramLineNum].text;
	}
	
	this.getLineUpdated = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		if ( this.document[ paramLineNum ].updated == 1 ) return true;
		else return false;
	}
	
	// This function returns the block object defining the current selection within the document.  If nothing is selected, this method returns false;
	this.getCurrentSelection = function( ) {
		if ( typeof this.currentSelection != 'object' ) return false;
		return this.currentSelection;
	}
	
	
	this.insertWord = function(theWord, startChar, endChar, currentLine)
	{
		alert("received " + theWord);
		
		
	}
	// Returns the text within a specified range.  The range is defined by a starting Line/Column and an ending Line/Column value.  
	// This function returns an ARRAY of lines of text.  The first and last lines in the array will be 'partial' lines, based on the given range.
	// This function is responsible for getting the range correct whether or not the 'start' and 'end' are given in the correct order.
	this.getTextInRange = function(paramStartLine,paramStartColumn,paramEndLine,paramEndColumn, paramArrayOrPlaintext) {
		// Validate the input.  If the input is not valid, return with an error.
		if ( !this.isLegalPosition( paramStartLine, paramStartColumn ) || !this.isLegalPosition( paramEndLine, paramEndColumn ) ) return false;
		
		// Declare local variables
		var startLine, startColumn;
		var endLine, endColumn;
		var returnText = new Array();
		
		// Determine the correct order of the ordered pairs:
		// if paramStartLine < paramEndLine, then they are correct
		if ( paramStartLine < paramEndLine ) { 
			startLine = paramStartLine;	startColumn = paramStartColumn;
			endLine = paramEndLine;	endColumn = paramEndColumn;
		}
		// If paramStartLine > paramEndLine, then they are backwards
		else if ( paramStartLine > paramEndLine ) {
			startLine = paramEndLine; startColumn = paramEndColumn;
			endLine = paramStartLine; endColumn = paramStartColumn;
		}
		// else, they must be on the same line...
		else {
			// If paramStartColumn <= paramEndColumn, it is correct
			if ( paramStartColumn <= paramEndColumn ) {
				startLine = paramStartLine; startColumn = paramStartColumn;
				endLine = paramEndLine; endColumn = paramEndColumn;
			}
			// Otherwise, they are backwards
			else {
				startLine = paramEndLine; startColumn = paramEndColumn; 
				endLine = paramStartLine; endColumn = paramStartColumn;
			}
		}

		// Populate the return array with the appropriate text
		var numLinesSpanned = endLine - startLine + 1;
		if ( numLinesSpanned == 1 ) {
			returnText.push( this.getLineText(startLine).substring(startColumn, endColumn) );
		}
		else {
			returnText.push( this.getLineText(startLine).substring(startColumn));
			for (i=1;i<numLinesSpanned-1;i++) {
				returnText.push( this.getLineText( startLine+i ) );
			}
			returnText.push( this.getLineText(endLine).substring(0, endColumn) );
		}
		
		// Format output according to optional paramArrayOrPlaintext value;  0 is default (Array), 1 is for plaintext.
		if ( paramArrayOrPlaintext == 1 ) return returnText.join("\n");
		else return returnText;
		
	}
	
	// Insert a line with the given text into the document at the specified line number
	this.insertLine = function( paramLineNum, paramText ) {
		if ( paramLineNum > this.getDocumentLength() || paramLineNum < 0 ) return false;
		
		// Create a new HTML div, insert it correctly in the existing HTML document, and provide the document line a handle on the div for rendering
		var newDiv = this.htmlDocumentPane.createElement('div');
		newDiv.setAttribute('class', "line");
		if( isIE ) newDiv.className = "line";
		
		//newDiv.setAttribute('id', "Line:"+this.uniqueNameCounter++);
		newDiv.innerHTML = paramText;
		// Try inserting the new div.  If it fails, we must be on the last line, so then just append it instead.
		try {
			this.htmlDocumentContent.insertBefore( newDiv, this.getLineHandle(paramLineNum) );
		} catch (e) {
			this.htmlDocumentContent.appendChild( newDiv );
		}
		
		this.document.splice( paramLineNum, 0, new this.line( newDiv, "Line: "+this.uniqueNameCounter++, paramText ) );

		this.setLineUpdated(paramLineNum);
		
		if(this.updateToServer == true){
			updateDocument( "i", paramText, paramLineNum );
		}
		return true;
	}
	
	// Insert some arbitrary text into the document at the specified position in the document.  This function is designed to accept any textual input, including an array of text.
	// Array elements will be treated as candidates of new lines, and text will be parsed by newline characters and split into lines from there as well.  This function should be able
	// to check for invalid input, and reject it if necessary.  This function returns the would-be coordinates of the cursor.
	this.insertText = function( paramTextObject, paramLineNum, paramColumnNum ) {
		// Validate coordinate of insertion
		if ( !this.isLegalPosition( paramLineNum, paramColumnNum ) ) return false;
		
		// If neither paramLineNum NOR paramColumnNum are supplied, it shall be assumed that the programmer intended to append the text to the end of the document
		if ( paramLineNum == null ) {
			paramLineNum = this.getDocumentLength()-1;
			paramColumnNum = this.getLineLength( paramLineNum );
		}
				
		// Process the input parameter
		var insertArray = this.processInput( paramTextObject );
		
		// Prep for insertion into the target line
		var targetLineFirstHalf = this.getLineText( paramLineNum ).substring( 0, paramColumnNum );
		var targetLineSecondHalf = this.getLineText( paramLineNum ).substring( paramColumnNum );
		
		// Insert our lines into the document
		for (i=0;i<insertArray.length;i++) {
			this.insertLine( paramLineNum+i, insertArray[i] );
		}
		// Prepend the original line's first half back to the original line
		this.setLineText( paramLineNum, targetLineFirstHalf + insertArray[0] );
		// Append the original line's second half at end of last new line
		this.setLineText( paramLineNum+insertArray.length-1, this.getLineText( paramLineNum+insertArray.length-1 ) + targetLineSecondHalf );
		
		this.updateToServer = true;
		
		// Return the coordinates of the character following the end of the inserted text
		return [paramLineNum+insertArray.length-1, insertArray[insertArray.length-1].length ];
	}
	
	// This function takes a lineNumber and an optional columnNumber and determines if their values are within bounds of the document
	this.isLegalPosition = function( paramLineNum, paramColumnNum ) {
		if ( paramLineNum >= this.getDocumentLength() || paramLineNum < 0 ) return false;
		if ( paramColumnNum == null ) return true;
		else if ( paramColumnNum > this.getLineLength(paramLineNum) || paramColumnNum < 0 ) return false;
		else return true;
	}
	
	// This function locks a line for the specified user.  The function takes as parameters the line # and the name of the user locking the line.  The function returns true on success and false on failure.
	this.lockLine = function( paramLineNum, paramLockingUser ) {
		// Ensure legality of selected line and that the user has a name
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		if ( paramLockingUser == undefined || paramLockingUser == null ) return false;
		
		// Set the isLockedBy field of the selected line, thus locking the line.  NOTE: CURRENTLY, THE TEXTDOCUMENTCLASS DOES NOT ENFORCE LOCKING.
		this.document[paramLineNum].isLockedBy = paramLockingUser;
		return true;
	}
	
	// This function is a utility function which processes input such that it is legal ready for use in the document
	// It accepts strings or arrays as input, and will return an array as output such that each element represents a line, or returns false otherwise
	this.processInput = function( paramInput ) {
		// Declare local variables
		var inputType;
		
		// Detect what type of input we are dealing with, and reject invalid types
		if ( typeof paramInput == 'object' ) {
			if ( paramInput.join ) inputType = 'array';
			else if ( paramInput.split ) inputType = 'string';
		} 
		else if ( typeof paramInput == 'string' ) inputType = 'string';
		else return false;  // Rejected...
		
		// String input needs to be split by return/linefeeds;  Arrays need to be joined first, adding a return/linefeed at each element (line), and then 
		// reprocessed into an array of lines (this way, it will absorb the possible line breaks present in the strings within the array elements
		if( isIE == true ){
			// In IE, if javascript split is used with a regular expression, it ignores blank lines, -- like when two delimeters are matched in a row (\n\n)
			if ( inputType == 'string' ) return paramInput.replace(/\t/g,"    ").replace(/\r\n|\r|\n/g,"\n").split("\n");
			if ( inputType == 'array' ) return paramInput.join("\r\n").replace(/\t/g,"    ").replace(/\r\n|\r|\n/g,"\n").split("\n");
		}
		else{
			if ( inputType == 'string' ) return paramInput.replace(/\t/g,"    ").split(/\r\n|\r|\n/);
			if ( inputType == 'array' ) return paramInput.join("\r\n").replace(/\t/g,"    ").split(/\r\n|\r|\n/);
		}
		return false;
	}
	
	// Remove a line, specified by line number
	this.removeLine = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		
		// Remove the HTML div associated with the line
		var removeMe = this.getLineHandle( paramLineNum );
		removeMe.parentNode.removeChild( removeMe );
		// Remove the document line
		this.document.splice( paramLineNum, 1 );
		
		if(this.updateToServer == true){
			updateDocument( "d", "", paramLineNum );
		}
		return true;
	}
	
	// This function removes the text within a specified range, and optionally inserts the given text in it's place.  The function returns the would-be coordinates of the cursor.
	this.replaceTextInRange = function( paramStartLine, paramStartColumn, paramEndLine, paramEndColumn, paramText ) {
		// Validate the input.  If the input is not valid, return with an error.
		if ( !this.isLegalPosition( paramStartLine, paramStartColumn ) || !this.isLegalPosition( paramEndLine, paramEndColumn ) ) return false;
		
		// Declare local variables
		var startLine, startColumn;
		var endLine, endColumn;
		
		// Determine the correct order of the ordered pairs:
		// if paramStartLine < paramEndLine, then they are correct
		if ( paramStartLine < paramEndLine ) { 
			startLine = paramStartLine;	startColumn = paramStartColumn;
			endLine = paramEndLine;	endColumn = paramEndColumn;
		}
		// If paramStartLine > paramEndLine, then they are backwards
		else if ( paramStartLine > paramEndLine ) {
			startLine = paramEndLine; startColumn = paramEndColumn;
			endLine = paramStartLine; endColumn = paramStartColumn;
		}
		// else, they must be on the same line...
		else {
			// If paramStartColumn <= paramEndColumn, it is correct
			if ( paramStartColumn <= paramEndColumn ) {
				startLine = paramStartLine; startColumn = paramStartColumn;
				endLine = paramEndLine; endColumn = paramEndColumn;
			}
			// Otherwise, they are backwards
			else {
				startLine = paramEndLine; startColumn = paramEndColumn; 
				endLine = paramStartLine; endColumn = paramStartColumn;
			}
		}
		
		// Remove all appropriate text, leaving only... the appropriate text
		var numLinesSpanned = endLine - startLine + 1;
		if ( numLinesSpanned == 1 ) {
			this.setLineText( startLine, this.getLineText(startLine).substring(0, startColumn) + this.getLineText(startLine).substring(endColumn) );
		}
		else {
			this.setLineText( startLine, this.getLineText(startLine).substring(0, startColumn) );
			for (i=1;i<numLinesSpanned-1;i++) {
				this.removeLine( startLine+i );
			}
			this.setLineText( endLine, this.getLineText(endLine).substring(endColumn) );
		}
		
		// Depending on whether we are inserting text in place of that which we just deleted, perform the appropriate action and return the correct coordinates
		if ( paramText == undefined || paramText == "" ) {
			// Return the coordinates of the start posiiton of the selection which was deleted
			return [startLine, startColumn];
		}
		// Calling insertText returns what we want...
		else return this.insertText( paramText, startLine, startColumn );
	}
	
	/* NOTE: setLineId is deliberately omitted.  Id's shall be handled internally by the document structure during line creation only */
	// Set the text of a specified line to equal paramText
	this.setLineText = function( paramLineNum, paramText ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		// Set the text
		this.document[paramLineNum].text = paramText;
		// Flag this line for update
		this.setLineUpdated( paramLineNum );
		
		if(this.updateToServer == true){
			updateDocument( "u", paramText, paramLineNum );
		}
		return true;
	}
	/*
	 * Checks to see if the line has already been indexed for syntax highlighting
	 */
	this.indexedStatus = function(lineNumber)
	{
		return this.document[lineNumber].indexed;
	}
	/*
	 *
	 */
	this.setIndexedStatus = function(lineNumber, status)
	{
		this.document[lineNumber].indexed = status;
	}
	this.setLineUpdated = function ( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		this.updateTracker.push( paramLineNum );
		return true;
	}
	
	// This function sets the current selection.  Currently, it is not forgiving of invalid line/column numbers.  This may change in the future
	this.setCurrentSelection = function( paramStartLine, paramStartColumn, paramEndLine, paramEndColumn ) {
		if ( !this.isLegalPosition( paramStartLine, paramStartColumn ) || !this.isLegalPosition( paramEndLine, paramEndColumn ) ) return false;
		this.currentSelection.startLine = paramStartLine;
		this.currentSelection.startColumn = paramStartColumn;
		this.currentSelection.endLine = paramEndLine;
		this.currentSelection.endColumn = paramEndColumn;
		this.isSelection = true;
		return true;
	}
	
	// This function unlocks the specified line.  It is the counterpart of this.lockLine.
	this.unlockLine = function( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		this.document[paramLineNum].isLockedBy = null;
		return true;
	}
	
	// This function updates the currentSelection (called when the cursor is moved while the document is in "select-mode"
	this.updateSelection = function( paramNewEndLine, paramNewEndColumn ) {
		if ( !this.isLegalPosition( paramNewEndLine, paramNewEndColumn ) ) return false;
		if ( this.currentSelection.startLine == null ) return false;
		this.currentSelection.endLine = paramNewEndLine;
		this.currentSelection.endColumn = paramNewEndColumn;
		return true;
	}
	
	
	
	
	///////////////////////////////////////////////////////////
	////////////// RENDERING-TYPE FUNCTIONS ///////////////
	
	this.renderEntireDocument = function ( paramCursorLine, paramCursorColumn ) {
		for(var ln=0; ln < this.document.length; ln++ ){
			this.renderLine( ln, paramCursorLine, paramCursorColumn );			
		}
	}

	this.renderLine = function ( paramLineNum, paramCursorLine, paramCursorColumn, paramLineObject ) {
		// Determine how this function is to used: direct mode (paramLineNum=-1 AND paramLineObject != null)  or indirect mode (by line number)
		var tmpLine;
		if ( paramLineNum == -1 && paramLineObject != null ) {
			tmpLine = paramLineObject;
		} else tmpLine = this.getLineByLineNumber( paramLineNum );
		
		// We need the line text and handle for every different possible outcome, so let's make the code more readable
		var lineText = tmpLine.text;
		var lineHandle = tmpLine.handle;
		var lineLockingUser = tmpLine.isLockedBy;
		
		// Ensure the renderer knows if syntaxHighlighting is on or not
		this.renderer.isSyntaxHiliteOn = syntaxHighlightOn;
				
		// Line is locked
		if ( lineLockingUser != null ) {
			lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.LOCKED, lineLockingUser, paramLineNum );
		}
		// Line contains cursor
		else if ( paramCursorLine == paramLineNum ) {
			
			// If there is a selection...
			if ( this.isSelection ) {
				// If this line contains the start of the selection, then it must contain the entire selection (since the cursor is always at position endLine/endColumn)
				if ( this.currentSelection.startLine == paramLineNum ) {
					// BUT... make sure the selection is not a null-selection!  If so, just render the cursor
					if ( this.currentSelection.startColumn == this.currentSelection.endColumn ) {
						lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.CURSOR, paramCursorColumn );
					}
					// If we *actually* have a selection, then render it
					else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_ENTIRE, this.currentSelection.startColumn, paramCursorColumn );
				}
				// If the startLine is AFTER the current (end) line, then we are at the head end of the selection.
				else if ( this.currentSelection.startLine > paramLineNum ) {
					lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_HEAD_CURSOR, paramCursorColumn );
				}
				// Otherwise, we must be at the tail of the selection
				else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_TAIL_CURSOR, paramCursorColumn );
			}
			// If there is no selection
			else if ( syntaxHighlightOn ) {
				lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SYNTAX_HILITE, paramCursorColumn );
			}
			else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.CURSOR, paramCursorColumn );
		}
		// If the line does not contain the cursor, and there is a selection...
		else if ( this.isSelection ) {
			
			// If the current line is the endpoint of the selection
			if ( this.currentSelection.startLine == paramLineNum ) {
				// If the current line is the 'head' of the selection
				if ( this.currentSelection.startLine < this.currentSelection.endLine ) {
					lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_HEAD, this.currentSelection.startColumn );
				}
				// Otherwise, the current line fully part of a selection (it isn't part of the tail, because by definition as I have it, that implies the cursor is present)
				else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_TAIL, this.currentSelection.startColumn );
			}
			// If the current line is not an enpoint of selection, and the current line is between the start and end lines...
			else if ( (this.currentSelection.startLine < paramLineNum && this.currentSelection.endLine > paramLineNum ) || ( this.currentSelection.startLine > paramLineNum && this.currentSelection.endLine < paramLineNum ) ) {
				lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SELECTION_LINE );
			}
			// Otherwise, the current line is outside the selection area
			else if ( syntaxHighlightOn ) {
				lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SYNTAX_HILITE );
			}
			else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.NORMAL );
		}
		// Otherwise, if the line does not contain the cursor and there is no selection, then
		else if ( syntaxHighlightOn ) {
			lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.SYNTAX_HILITE );
		}
		else lineHandle.innerHTML = this.renderer.renderLine( lineText, this.renderer.NORMAL );
	}
	
	this.renderUpdates = function ( paramCursorLine, paramCursorColumn ) {
		var numUpdates = this.updateTracker.length;
		for(var l=0; l < numUpdates; l++ ){
			if ( this.getLineUpdated( l ) ) {
				this.renderLine( this.updateTracker.pop(), paramCursorLine, paramCursorColumn );
			}
		}
	}
	

	/************************************************************/
	/*********** INITIALIZATION OF THIS INSTANCE ************/
	this.uniqueNameCounter = 0;
	this.updateTracker = new Array();
	this.htmlDocumentPane = paramHTMLDocumentPane;
	this.htmlDocumentContent = this.htmlDocumentPane.getElementById("entireDocument");
	this.document = new Array();
	this.renderer = new Renderer();	
	this.currentSelection = new this.block( null, null, null, null );
}