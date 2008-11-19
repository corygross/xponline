// This class will define a "renderer" object, whose responsibility is anything display-related

function Renderer()
{
	/* Constants representing valid values for paramMODE in the renderLine function */
	var NORMAL = 0;					// Normal rendering.  Does not require additional arguments.
	var CURSOR = 1;					// Rendering with the cursor in the line.  Requires paramArg1 to represent the position of the cursor in the line.
	var SELECTION_LINE = 2;		// Rendering with the entire line being part of the current selection.  Does not require additional arguments.
	var SELECTION_HEAD = 3;			// Rendering with the line being the START of a selection.  Requires paramArg1 to be the endpoint of the selection in this line.  
	var SELECTION_HEAD_CURSOR = 4;	// Rendering with the line being the start of a selection AND the selection is started at the cursor position.  Requires paramArg1 to be the position of the cursor.
	var SELECTION_TAIL = 5;			// Rendering with the line being the END of a selection.  Requires paramArg1 to be the endpoint of the selection in the line.
	var SELECTION_TAIL_CURSOR = 6;	// Rendering with the line being the END of a selection, with the endpoint at the cursor position. Requires paramArg1 to be the cursor position.
	var SELECTION_ENTIRE = 7;		// Rendering with the line containing a whole selection.  Requires paramArg1 to be the endpoint of selection and paramArg2 to be the position of the cursor.
	var LOCKED = 8;		// Rendering with the line being locked.  

	/* This function is the main rendering function.  It renders a single line, taking all factors into consideration (at least, it should...) */
	/* Parameters:  paramLineText ==> Text for the line which is being rendered
	 *		      paramMODE ==> Determines how the line will be rendered (and how the following parameters are treated)  Valid values are integers.  Use constant values defined in this class.
	 *		      paramArg1 ==> Valid values depend on the MODE, and usually the length of the LineText (since we are usually, if not always asking for a position value)
	 *		      paramArg2 ==> Ditto. */
	this.renderLine = function ( paramLineText, paramMODE, paramArg1, paramArg2 ) {
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
