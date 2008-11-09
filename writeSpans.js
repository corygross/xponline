/*
 * Function:writeSpans
 *
 * Purpose: Encapsulate each letter of a word in a span
 * 			so that when the cursor intersects a word, the
 *			highlighted syntax does not go away.
 */
function writeSpans(word, syntaxCheck)
{
	var newWord = "";
	var letters = word.split("");
	
	//This should not be highlighted
	if(syntaxCheck == "none")
	{
		for(var counter = 0; counter < letters.size(); counter++)
		{
			newWord += "<span class='none'>" + letters[counter] + "</span>";
		}
	}
	else
		if(syntaxCheck == "space")
		{
			newWord += "<span class='space'>" + " " + "</span>";
		}
	else
	{
		for(var counter = 0; counter < letters.size(); counter++)
		{
			//We're more than likely found the curslr
			//		if(letters[counter] == '<'){alert("I think I found the cursor tag");}
		
			//Check for the cursor tag
			//alert(letters[counter]);
		
			newWord += "<span class='" + word + "'>" + letters[counter] + "</span>";
		//	alert(newWord); //For initial testing
		}
		delete letters;
	}
	return newWord;
}