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
		this.updated = 1;	// 1=true
	}
	//this.blockTracker;				// TODO: This is to be an array of start/end coordinates for blocks of text (code blocks / comments / etc )
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
		this.document = new Array();
		this.appendLine("");				// This avoids null-related errors in several places
		this.uniqueNameCounter = 0;			// This variable is used to provide unique id's to each line
		this.documentID = "";
		this.updateToServer = false;
	}
	
	// Returns the length of the document in number of lines
	this.getDocumentLength = function() {
		return this.document.length;
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
	
	// Returns the text within a specified range.  The range is defined by a starting Line/Column and an ending Line/Column value.  
	// This function returns an ARRAY of lines of text.  The first and last lines in the array will be 'partial' lines, based on the given range.
	// This function is responsible for getting the range correct whether or not the 'start' and 'end' are given in the correct order.
	this.getTextInRange = function(paramStartLine,paramStartColumn,paramEndLine,paramEndColumn) {
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
		var numLinesSpanned = endLine - startLine;
		if ( numLinesSpanned == 0 ) {
			returnText.push( this.getLineText(startLine).substring(startColumn, endColumn) );
		}
		else {
			returnText.push( this.getLineText(startLine).substring(startColumn));
			for (i=0;i<numLinesSpanned-1;i++) {
				returnText.push( this.getLineText( startLine+i ) );
			}
			returnText.push( this.getLineText(endLine).substring(0, endColumn) );
		}
		return returnText;
	}
	
	// Insert a line with the given text into the document at the specified line number
	this.insertLine = function( paramLineNum, paramText ) {
		if ( paramLineNum > this.getDocumentLength() || paramLineNum < 0 ) return false;
		
		// Create a new HTML div, insert it correctly in the existing HTML document, and provide the document line a handle on the div for rendering
		var newDiv = this.htmlDocumentPane.createElement('div');
		newDiv.setAttribute('class', "line");
		//newDiv.setAttribute('id', "Line:"+this.uniqueNameCounter++);
		newDiv.innerHTML = paramText;
		// Try inserting the new div.  If it fails, we must be on the last line, so then just append it instead.
		try {
			this.htmlDocumentContent.insertBefore( newDiv, this.getLineHandle(paramLineNum) );
			//alert("not caught");
		} catch (e) { //alert("caught");
			this.htmlDocumentContent.appendChild( newDiv );
		}
		
		this.document.splice( paramLineNum, 0, new this.line( newDiv, "Line: "+this.uniqueNameCounter++, paramText ) );
		
		if(this.updateToServer == true){
			updateDocument( "i", paramText, paramLineNum );
		}
	}
	
	// Insert some arbitrary text into the document at the specified position in the document.  This function is designed to accept any textual input, including an array of text.
	// Array elements will be treated as candidates of new lines, and text will be parsed by newline characters and split into lines from there as well.  This function should be able
	// to check for invalid input, and reject it if necessary
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
	}
	
	// This function takes a lineNumber and an optional columnNumber and determines if their values are within bounds of the document
	this.isLegalPosition = function( paramLineNum, paramColumnNum ) {
		if ( paramLineNum >= this.getDocumentLength() || paramLineNum < 0 ) return false;
		if ( paramColumnNum == null ) return true;
		else if ( paramColumnNum > this.getLineLength(paramLineNum) || paramColumnNum < 0 ) return false;
		else return true;
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
			if ( inputType == 'string' ) return paramInput.replace(/\t/g,"").replace(/\r\n|\r|\n/g,"\n").split("\n");
			if ( inputType == 'array' ) return paramInput.join("\r\n").replace(/\t/g,"").replace(/\r\n|\r|\n/g,"\n").split("\n");
		}
		else{
			if ( inputType == 'string' ) return paramInput.replace(/\t/g,"").split(/\r\n|\r|\n/);
			if ( inputType == 'array' ) return paramInput.join("\r\n").replace(/\t/g,"").split(/\r\n|\r|\n/);
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
	}
	
	this.setLineUpdated = function ( paramLineNum ) {
		if ( !this.isLegalPosition( paramLineNum ) ) return false;
		this.updateTracker.push( paramLineNum );
	}
	
	
	
	
	///////////////////////////////////////////////////////////
	////////////// RENDERING-TYPE FUNCTIONS ///////////////
	
	this.renderEntireDocument = function () {
		for(var l=0; l < this.document.length; l++ ){
			this.renderLine( l );
		}
	}
	
	this.renderLine = function ( paramLineNum, paramCursorLine, paramCursorColumn ) {
		if ( paramCursorLine == paramLineNum )
			this.getLineHandle( paramLineNum ).innerHTML = this.renderer.renderLine( this.getLineText( paramLineNum ), paramCursorColumn );
		else this.getLineHandle( paramLineNum ).innerHTML = this.renderer.renderLine( this.getLineText( paramLineNum ) );
	}
	
	this.renderUpdates = function ( paramCursorLine, paramCursorColumn ) {
		var numUpdates = this.updateTracker.length;
		//for(var l=0; l < this.updateTracker.length; l++ ){
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
}