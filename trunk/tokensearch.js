/*
 * TODO: Determine how we will get reserved words data to the client
 */
var reservedWords = new Array('public', 'static', 'void', 'System');
//var theURL = "./handlers/getTokens.php";

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
 */
function tokenSearch(term)
{
	var beforeCount = reservedWords.size();
	var newArr = reservedWords.without(term);
	var afterCount = newArr.size();
	delete newArr; 
	
	(beforeCount == afterCount) ? output=false : output=true;
	return output;
}