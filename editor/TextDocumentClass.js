alert("loading TextDocumentClass.js");
// Data structure to hold unformatted document
function TextDocument() 
{
	//////////////////////////////////////////////////
	////////////// MEMBER VARIABLES ////////////////
	
	// Sub-data structure for each lineId,lineText pair
	this.line = function( paramLineId, paramLineText )
	{
		this.id = paramLineId;
		this.text = paramLineText;
	}
	this.document = new Array();		// This is to be an array of lines
	this.uniqueNameCounter = 0;		// This variable is used to provide unique id's to each line
	this.documentID = null;
	
	//////////////////////////////////////////////////
	////////////// MEMBER FUNCTIONS ///////////////

	// This function adds a line to the end of the document
	this.appendLine = function( paramText ) {
		this.insertLine( this.getDocumentLength(), paramText );
	}
	//  Clears the contents of the document
	this.blankDocument = function() {
		this.document = new Array();
		this.uniqueNameCounter = 0;		// This variable is used to provide unique id's to each line
		this.documentID = null;
	}
	// Returns the length of the document in number of lines
	this.getDocumentLength = function() {
		return this.document.length;
	}
	// Returns the length of the specified line
	this.getLineLength = function( paramLineNum ) {
		if ( paramLineNum < this.getDocumentLength() ) return this.getLineText( paramLineNum ).length;
		else return false;
	}
	// Returns the id of the specified line
	this.getLineId = function( paramLineNum ) {
		if ( paramLineNum < this.document.length && paramLineNum != -1 ) return this.document[paramLineNum].id;
		else return false;
	}
	// Returns the text of the specified line
	this.getLineText = function( paramLineNum ) {
		if ( paramLineNum < this.getDocumentLength() && this.document[paramLineNum] != undefined ) {
			return this.document[paramLineNum].text;
		//RT - Theory test
		//return this.document[paramLineNum].innerHTML;
		}
		else return false;
	}
	// Insert a line with the given text into the document at the specified line number
	this.insertLine = function( paramLineNum, paramText ) {
		paramText = this.replaceTab( paramText );
		paramText = this.BUGFIX_SPACE( paramText );
		
		if ( paramLineNum <= this.getDocumentLength() && paramLineNum >= 0 ) {
			this.document.splice( paramLineNum, 0, new this.line( "line"+this.uniqueNameCounter, paramText ) );
			this.uniqueNameCounter++;
		} else return false;
	}
	// Remove a line, specified by line number
	this.removeLine = function( paramLineNum ) {
		if ( paramLineNum <= this.getDocumentLength() && paramLineNum >= 0 ) this.document.splice( paramLineNum, 1 );
		else return false;
	}
	// Replace tabs with 4 spaces
	this.replaceTab = function( paramText ) {
		return paramText.replace(/\t/g,"    ");
	}
	/* NOTE: setLineId is deliberately omitted.  Id's shall be handled internally by the document structure during line creation only */
	// Set the text of a specified line to equal paramText
	this.setLineText = function( paramLineNum, paramText ) {
		paramText = this.BUGFIX_SPACE( paramText );
		if ( paramLineNum < this.getDocumentLength() ) {
			this.document[paramLineNum].text = paramText;
		}
		else return false;
	}
	// BUGFIX FUNCTION.  Returns paramText, after ensuring the last char is a space character
	this.BUGFIX_SPACE = function( paramText ) {
		// FIX RENDERING ISSUE FOR HTML: If last character of a line is not a space character, then append one.
		// This fixes 2 things: 1.) allows the cursor to be at the 'true' end of the line
		//                      2.) fixes bug where blank lines are not rendered
		if ( paramText.charAt(paramText.length-1) != ' ' ) paramText = paramText + ' ';
		return paramText;
	}	
}
