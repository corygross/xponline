var defaultStyleSheet = "default.css";

function toggleSyntaxHighlighting()
{
	var testVar = getDoc().getElementById('SS').href;
	if(testVar.indexOf("java.css") == -1)
	{
		getDoc().getElementById('SS').href = "../java.css"; return;
	}
	getDoc().getElementById('SS').href = "../" + defaultStyleSheet;
	
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
	return (testVar == -1) ? true : false;
}
