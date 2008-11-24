var defaultStyleSheet = "default.css";

function toggleSyntaxHighlighting()
{
	// We need this syntaxHighlightOn var to use elsewhere
	syntaxHighlightOn = !syntaxHighlightOn;
	if( syntaxHighlightOn ){
		getDoc().getElementById('SS').href = "../syntaxHighlight/java.css";
		if( documentIsOpen() ) XPODoc.renderEntireDocument(cursorLine, cursorColumn);
	}
	else{
		getDoc().getElementById('SS').href = "../" + defaultStyleSheet;
	}
	giveDocumentFocus();
	/*
	//alert("the current language is " + getCurrentLanguage());
	var testVar = getDoc().getElementById('SS').href;
	if(testVar.indexOf(defaultStyleSheet) != -1)
//	if(!checkSyntaxHighlighting())
	{
		//Set the style sheet based on the file extension
		if(getCurrentLanguage() == "java")
		{
			getDoc().getElementById('SS').href = "../java.css"; return;
		}
	}
	getDoc().getElementById('SS').href = "../" + defaultStyleSheet;
	*/
}	

/*
 * Function: checkSyntaxHighlighting
 *
 * Purpose: Checks to see if syntax highlighting is active
 *
 * Input: None
 * Output: True - if syntax highlighting is active
 *		   False - if syntax highlighting is not active
 *
 * Preconditions: None
 * Postconditions: None
 *
 */
function checkSyntaxHighlighting()
{
	var testVar = (getDoc().getElementById('SS').href).indexOf(defaultStyleSheet); //Or whatever the default css is 
	var check = (testVar == -1);
	return (testVar == -1) ? false : true;
}
