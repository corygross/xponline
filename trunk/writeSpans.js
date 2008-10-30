/*
 * Function:writeSpans
 *
 * Purpose: Encapsulate each letter of a word in a span
 * 			so that when the cursor intersects a word, the
 *			highlighted syntax does not go away.
 */
function writeSpans(word)
{
	//alert("received " + word);
	var newWord = "";
	var letters = word.split("");
	for(var counter = 0; counter < letters.size(); counter++)
	{
		newWord += "<span class='" + word + "'>" + letters[counter] + "</span>";
	//	alert(newWord); //For initial testing
	}
	delete letters;
	return newWord;
}