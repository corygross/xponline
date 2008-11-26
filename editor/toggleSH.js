// This function toggles syntax highlighting on and off
function toggleSyntaxHighlighting()
{
	// We need this syntaxHighlightOn var to use elsewhere
	syntaxHighlightOn = !syntaxHighlightOn;
	setHighlightingStyleSheet();
}

// The function selects the proper style sheet to use for the document highlighting
function setHighlightingStyleSheet()
{
	// Apply some sort of styling based on the current language, and whether syntax highlighting is on or off
	if( syntaxHighlightOn ){
		var newStyleSheet;
		switch( getCurrentLanguage() )
		{
			case 'java':
				newStyleSheet = "../syntaxHighlight/java.css";
				break;
			case 'php':
				newStyleSheet = "../syntaxHighlight/php.css";
				break;
			default:
				newStyleSheet = "../syntaxHighlight/default_highlight_on.css";
		}
	
		getDoc().getElementById('SS').href = newStyleSheet;
		if( documentIsOpen() ) XPODoc.renderEntireDocument(cursorLine, cursorColumn);
	}
	else{
		getDoc().getElementById('SS').href = "../syntaxHighlight/default_highlight_off.css";
	}
	
	// Give the focus back to the document
	giveDocumentFocus();
}