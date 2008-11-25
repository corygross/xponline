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
 * Preconditons: term must be a single token otherwise this
 *				 breaks to high hell.
 * 
 */
var wordsString = null;
function tokenSearch(term)
{
<<<<<<< .mine
//	alert("Received" + term + "Word");
=======
	if( wordsString == null ){
		wordsString = "~" + syntax_words.join("~") + "~";
	}
	
	if( wordsString.indexOf("~"+term+"~") != -1 ) return true;	// The token was in the list
	else if( term.match(/^\d+$/) ) return true;		// The token was an integer
	else return false;
}

/*
function tokenSearch(term)
{
>>>>>>> .r199
	var reservedWords = javawords;	//Right now, just default to java syntax highlighting
	var beforeCount = reservedWords.size();
	var newArr = reservedWords.without(term);
	var afterCount = newArr.size();
//	alert("BeforeCount is "+ beforeCount);
//	alert("AfterCount is " + afterCount);
   	delete newArr; 
	
	(beforeCount == afterCount) ? output=false : output=true;
//	alert("Returning "+ output);
	return output;
}
*/