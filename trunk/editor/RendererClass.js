// This class will define a "renderer" object, whose responsibility is anything display-related

function Renderer()
{
	/* Constants representing valid values for paramMODE in the renderLine function */
	this.NORMAL = 0;				// Normal rendering.  Does not require additional arguments.
	this.CURSOR = 1;					// Rendering with the cursor in the line.  Requires paramArg1 to represent the position of the cursor in the line.
	this.SELECTION_LINE = 2;		// Rendering with the entire line being part of the current selection.  Does not require additional arguments.
	this.SELECTION_HEAD = 3;			// Rendering with the line being the START of a selection.  Requires paramArg1 to be the endpoint of the selection in this line.  
	this.SELECTION_HEAD_CURSOR = 4;	// Rendering with the line being the start of a selection AND the selection is started at the cursor position.  Requires paramArg1 to be the position of the cursor.
	this.SELECTION_TAIL = 5;			// Rendering with the line being the END of a selection.  Requires paramArg1 to be the endpoint of the selection in the line.
	this.SELECTION_TAIL_CURSOR = 6;	// Rendering with the line being the END of a selection, with the endpoint at the cursor position. Requires paramArg1 to be the cursor position.
	this.SELECTION_ENTIRE = 7;		// Rendering with the line containing a whole selection.  Requires paramArg1 to be the endpoint of selection and paramArg2 to be the position of the cursor.
	this.LOCKED = 8;		// Rendering with the line being locked.  
	this.SYNTAX_HILITE = 9;			// Rendering with the line syntax highlighted

	/* This function is the main rendering function.  It renders a single line, taking all factors into consideration (at least, it should...) */
	/* Parameters:  paramLineText ==> Text for the line which is being rendered
	 *		      paramMODE ==> Determines how the line will be rendered (and how the following parameters are treated)  Valid values are integers.  Use constant values defined in this class.
	 *		      paramArg1 ==> Valid values depend on the MODE, and usually the length of the LineText (since we are usually, if not always asking for a position value)
	 *		      paramArg2 ==> Ditto. */
	this.renderLine = function ( paramLineText, paramMODE, paramArg1, paramArg2 ) {
		/* If the line we are rendering is empty, we must add a space so that it will actually be rendered in HTML.  
		 * The space is temporary, and thus is not actually written to the document. */
		if ( paramLineText == "" ) paramLineText = ' ';
		
		// Switch statement to handle different values of paramMODE
		switch ( paramMODE )
		{
			case this.CURSOR:
				// paramArg1 = the cursor position
				var tempCurrentLine = new Array();
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push(replaceHTMLEntities( paramLineText.substr(paramArg1, 1)) );
		        tempCurrentLine.push(replaceHTMLEntities( paramLineText.substring(paramArg1+1)) );
				
				if ( tempCurrentLine[1] == "" ) tempCurrentLine[1] = ' ';
				
				tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
				return tempCurrentLine.join("");
			
			case this.LOCKED:
				// paramArg1 = the name of the user that locked the line
				// paramArg2 = the current line number
				return "<span class='lock' onMouseOver=\"makeNewLockPopup(event,'lock"+paramArg2+"','"+paramArg1+"')\" onMouseOut=\"closeLockPopup('lock"+paramArg2+"')\">" + replaceHTMLEntities( paramLineText ) + "</span>";
			
			case this.NORMAL:
				return replaceHTMLEntities( paramLineText );
				
			case this.SELECTION_HEAD:
				// paramArg1 = the starting position of the selection
				var tempCurrentLine = new Array();
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1)) );
				tempCurrentLine[1] = "<span id='selection'>" + tempCurrentLine[1] + "</span>";
				return tempCurrentLine.join("");
				
			case this.SELECTION_HEAD:
				// paramArg1 = the starting position of the selection
				var tempCurrentLine = new Array();
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1)) );
				tempCurrentLine[1] = "<span id='selection'>" + tempCurrentLine[1] + "</span>";
				return tempCurrentLine.join("");
				
			case this.SELECTION_HEAD_CURSOR:
				// paramArg1 = the starting position of the selection (and the cursor position)
				var tempCurrentLine = new Array();
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1,1)) );
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1+1)) );
				tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
				tempCurrentLine[2] = "<span id='selection'>" + tempCurrentLine[2] + "</span>";
				return tempCurrentLine.join("");
				
			case this.SELECTION_LINE:
				return "<span id='selection'>" + replaceHTMLEntities( paramLineText ) + "</span>";
			
			case this.SELECTION_TAIL:
				// paramArg1 = the starting position of the selection
				var tempCurrentLine = new Array();
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1)) );
				tempCurrentLine[1] = "<span id='selection'>" + tempCurrentLine[0] + "</span>";
				return tempCurrentLine.join("");
				
			case this.SELECTION_TAIL_CURSOR:
				// paramArg1 = the starting position of the selection (and the cursor position)
				var tempCurrentLine = new Array();
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,paramArg1)) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1,1)) );
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(paramArg1+1)) );
				tempCurrentLine[0] = "<span id='selection'>" + tempCurrentLine[0] + "</span>";
				tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
				return tempCurrentLine.join("");
				
			case this.SELECTION_ENTIRE:
				// paramArg1 = the starting position of the selection
				// paramArg2 = the cursor position
				
				/* Local variables */
				var tempCurrentLine = new Array();
				var tempPosition1, tempPosition2;
				
				/* Need to know which order we need to operate in */
				if ( paramArg1 <= paramArg2 ) {
					tempPosition1 = paramArg1;
					tempPosition2 = paramArg2;
				}
				else {
					tempPosition1 = paramArg2;
					tempPosition2 = paramArg1;
				}
				
				/* Slice 'n dice */
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substring(0,tempPosition1) ) );
		        tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(tempPosition1,tempPosition2) ) );
				tempCurrentLine.push( replaceHTMLEntities( paramLineText.substr(tempPosition2) ) );
				
				/* Determine position of cursor */
				if ( tempPosition1 == paramArg2 ) {
					// Cursor is the first position
					tempCurrentLine[1] = "<span id='cursor'>"+replaceHTMLEntities( tempCurrentLine[1].substring(0,1) )+"</span><span id='selection'>"+replaceHTMLEntities( tempCurrentLine[1].substr(1) )+"</span>";
				}
				else {
					// Cursor is the second position
					tempCurrentLine[1] = "<span id='selection'>"+tempCurrentLine[1].substring(0,tempCurrentLine[1].length-1)+"</span><span id='cursor'>"+tempCurrentLine[1].substr(tempCurrentLine[1].length-1)+"</span>";
				}
				// Return this mess
				return tempCurrentLine.join("");
				
			case this.SYNTAX_HILITE:
				// paramArg1 = cursor position
				return this.syntaxHighlight(paramLineText, paramArg1);
				
		} // END SWITCH
	}
	
	/************************************/
	/******** UTILITY FUNCTIONS *******/
	
	this.classifyToken = function ( paramTokenText ) {
		if( paramTokenText.match(/^\d+$/) ) return "number";
		return paramTokenText;
	}
	
	this.findMatches = function( paramArray ) {		
		var resultArray = new Array();
		for(var counter = 0; counter < paramArray.length; counter++) {	
			var curWord = paramArray[counter];
			if( curWord.trim() != "" ){				
				if( tokenSearch(curWord) == true ) resultArray.push(curWord);				
			}
		}
		// Only return unique array entries
		return resultArray.uniq();
	}
	
	this.indexSortfunction = function(a, b){
		// Compare 'a' with 'b' and return -1 if a should be before b, 1 if b should be before a, and 0 if they are equal... this shouldn't happen in our case actually
		if( a.index < b.index ) return -1;
		else if( b.index < a.index ) return 1;
		return 0;
	}
	
	this.syntaxHighlight = function( paramText, paramCursorCol ) {
		var indexesArray = new Array();		
		var textBeforeComment;
		var commentIndex = paramText.indexOf("//");
		if( commentIndex != -1 ){
			// If we found some single line comments, add them into our array of found things, and don't check after their index for other tokens
			indexesArray.push(new this.tokenMatch( paramText.substring(commentIndex), paramText.length, "comment" ));
			textBeforeComment = paramText.substring(0, commentIndex-1);
		}
		else textBeforeComment = paramText;

		var matchesArray = this.findMatches( this.tokenizeText( textBeforeComment ) );
		
		// If no token matches, cursor, or comments, return plain text
		if( matchesArray.length == 0 && commentIndex == -1 && paramCursorCol == null ) return replaceHTMLEntities( paramText );
		
		// Find out what the indexes of each of our found tokens are in the line
		for(var i = 0; i < matchesArray.length; i++)
		{			
			var regEx = new RegExp("\\b"+matchesArray[i]+"\\b", "g");
			while(regEx.test(textBeforeComment)){
				indexesArray.push(new this.tokenMatch( matchesArray[i], regEx.lastIndex, this.classifyToken(matchesArray[i]) ));
			}						
		}

		// Sort all of the matches we found, based on the index that we found them at
		indexesArray.sort(this.indexSortfunction);
		
		var lineText = new Array();
		var lastEndIndex = paramText.length;
		if( lastEndIndex == paramCursorCol ) lastEndIndex++;
		
		// We start at the end of the for loop, so we don't mess up any of the indexes we have when we add spans
		for(var i = indexesArray.length-1; i >=0 ; i--)
		{
			// Found the cursor outside of a token
			if( paramCursorCol != null && paramCursorCol >= indexesArray[i].index && paramCursorCol <  lastEndIndex){
				var tempCurrentLine = new Array();
		        tempCurrentLine.push( replaceHTMLEntities( paramText.substring(indexesArray[i].index,paramCursorCol)) );
		        tempCurrentLine.push(replaceHTMLEntities( paramText.substr(paramCursorCol, 1)) );
		        tempCurrentLine.push(replaceHTMLEntities( paramText.substring(paramCursorCol+1,lastEndIndex)) );
				if ( tempCurrentLine[1] == "" ) tempCurrentLine[1] = ' ';
				tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
				lineText.push(tempCurrentLine.join(""));
			}
			// No token, no cursor
			else if( indexesArray[i].index < lastEndIndex ){ 
				lineText.push( replaceHTMLEntities(paramText.substring(indexesArray[i].index, lastEndIndex) ));
			}
			lastEndIndex = indexesArray[i].index - indexesArray[i].token.length;
			
			// Found the cursor within a token
			if( paramCursorCol != null && paramCursorCol >= lastEndIndex && paramCursorCol <  indexesArray[i].index){
				var tempCurrentLine = new Array();
				tempCurrentLine.push("<span class='"+indexesArray[i].tokenClass+"'>");
		        tempCurrentLine.push( replaceHTMLEntities( paramText.substring(lastEndIndex,paramCursorCol)) );
				tempCurrentLine.push("</span>");
		        tempCurrentLine.push(replaceHTMLEntities( paramText.substr(paramCursorCol, 1)) );
				tempCurrentLine.push("<span class='"+indexesArray[i].tokenClass+"'>");
		        tempCurrentLine.push(replaceHTMLEntities( paramText.substring(paramCursorCol+1,indexesArray[i].index)) );
				tempCurrentLine.push("</span>");
				if ( tempCurrentLine[3] == "" ) tempCurrentLine[3] = ' ';
				tempCurrentLine[3] = "<span id='cursor'>" + tempCurrentLine[3] + "</span>";
				lineText.push(tempCurrentLine.join(""));
			}
			// Found a token without the cursor in it
			else{
				lineText.push("</span>");
				lineText.push( replaceHTMLEntities(paramText.substring(lastEndIndex, indexesArray[i].index)) );
				lineText.push("<span class='"+indexesArray[i].tokenClass+"'>");
			}
		}
		// If we haven't reached the beginning of the line yet, we need to add that part in too
		if( paramCursorCol != null && lastEndIndex > 0 && paramCursorCol < lastEndIndex){
			var tempCurrentLine = new Array();
			tempCurrentLine.push( replaceHTMLEntities( paramText.substring(0,paramCursorCol)) );
			tempCurrentLine.push(replaceHTMLEntities( paramText.substr(paramCursorCol, 1)) );
			tempCurrentLine.push(replaceHTMLEntities( paramText.substring(paramCursorCol+1,lastEndIndex)) );
			if ( tempCurrentLine[1] == "" ) tempCurrentLine[1] = ' ';
			tempCurrentLine[1] = "<span id='cursor'>" + tempCurrentLine[1] + "</span>";
			lineText.push(tempCurrentLine.join(""));
		}
		else if( lastEndIndex > 0 ) lineText.push( replaceHTMLEntities( paramText.substring(0, lastEndIndex) ));
		
		// Reverse the array (because we added stuff backwards) and return it as a string
		lineText.reverse();
		return lineText.join("");
	}
	
	this.tokenizeText = function( paramText ) {
		// 
		//return paramText.split(/\.|\;|\{|\}|,|\[|\]|\b/g);
		return paramText.split(/\.|\;|\(|\)|\{|\}|,|\[|\]|\b/g);
	}

	this.tokenMatch = function( paramToken, paramIndex, paramTokenClass )
	{
		this.token = paramToken;	// The text of the token
		this.index = paramIndex;	// The last index in the token
		this.tokenClass = paramTokenClass;	// The classification of the token (used with css)
	}
	
	/* Replace some things like tabs, spaces, < and > */
	function replaceHTMLEntities( paramText ) {
		if(paramText.replace && paramText != ""){
			paramText = paramText.replace(/&/g, "&amp;"); // This one must be first
			paramText = paramText.replace(/>/g, "&gt;");
			paramText = paramText.replace(/</g, "&lt;");
			paramText = paramText.replace(/ /g, "&nbsp;");	
			paramText = paramText.replace(/\//g, "&#47;");
			paramText = paramText.replace(/\\/g, "&#92;");
			paramText = paramText.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
		}
		return paramText;
	}
	
}
