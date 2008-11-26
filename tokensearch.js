/*
 * Function: tokenSearch
 * 
 * Purpose: Determine if the 
 * 		    term is in the list 
 *			of reserved words.
 *
 * Parameters: term - the term to search for
 *					  in the list.
 *
 *
 *
 * Preconditons: none
 *				 
 * 
 */
var wordsString = null;
function tokenSearch(term)
{
	if( wordsString == null ){
		switch( languageFlag )
		{
			case 'java':
				wordsString = java_words;
				break;
			case 'other':
				wordsString = "";
				break;
			default:
				wordsString = default_words;
		}
	}

	
	if( wordsString.indexOf("~"+term+"~") != -1 ) return true;	// The token was in the list
	else if( term.match(/^\d+$/) ) return true;		// The token was an integer
	else return false;
}