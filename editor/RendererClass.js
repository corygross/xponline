// This class will define a "renderer" object, whose responsibility is anything display-related

function Renderer()
{
	/* This function is the main rendering function.  It renders a single line, taking all factors into consideration (at least, it should...) */
	this.renderLine = function ( paramLineText, paramCursorPosition ) {
		/* If the line we are rendering is empty, we must add a space so that it will actually be rendered in HTML.  
		 * The space is temporary, and thus is not actually written to the document. */
		if ( paramLineText == "" ) paramLineText = ' ';
		
		/* If the cursor position parameter is set, this implies that the cursor is at this line and must be rendered.  If not, it's business as usual. */
		if ( paramCursorPosition == undefined ) {
			return replaceHTMLEntities( paramLineText );
		}
		else {
			var tempCurrentLine = new Array();
	        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramCursorPosition)) );
	        tempCurrentLine.push(replaceHTMLEntities( paramLineText.substr(paramCursorPosition, 1)) );
	        tempCurrentLine.push(replaceHTMLEntities( paramLineText.substring(paramCursorPosition+1)) );
			if ( tempCurrentLine[1] == "" ) tempCurrentLine[1] = ' ';
			tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
			return tempCurrentLine.join("");
		}
	}
	
	/************************************/
	/******** UTILITY FUNCTIONS *******/
	
	this.classifyToken = function ( paramTokenText ) {
		
	}
	
	this.tokenizeText = function( paramText ) {
		
	}
	
	/* Replace some things like tabs, spaces, < and > */
	function replaceHTMLEntities( paramText ) {
		paramText = paramText.replace(/&/g, "&amp;"); // This one must be first
		paramText = paramText.replace(/>/g, "&gt;");
		paramText = paramText.replace(/</g, "&lt;");
		paramText = paramText.replace(/ /g, "&nbsp;");	
		paramText = paramText.replace(/\//g, "&#47;");
		paramText = paramText.replace(/\\/g, "&#92;");
		paramText = paramText.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	return paramText;
}
	
}
