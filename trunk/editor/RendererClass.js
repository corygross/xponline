// This class will define a "renderer" object, whose responsibility is anything display-related

function Renderer()
{
	this.renderLine = function ( paramLineText, paramCursorPosition ) {
		if ( paramLineText == "" ) paramLineText = ' ';
		if ( paramCursorPosition == undefined ) {
			return paramLineText;
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
		paramText = paramText.replace(/&/g, "&amp;"); // Leave this one first.
		paramText = paramText.replace(/>/g, "&gt;");
		paramText = paramText.replace(/</g, "&lt;");
		paramText = paramText.replace(/ /g, "&nbsp;");	
		paramText = paramText.replace(/\//g, "&#47;");
		paramText = paramText.replace(/\\/g, "&#92;");
		paramText = paramText.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
	return paramText;
}
	
}
