function changeColorScheme()
{
	var selectedColor = getCheckedColorScheme();
	if(selectedColor == ""){
		document.getElementById('colorSchemeSS').href = "colorSchemes/black.css";
	}
	else{
		document.getElementById('colorSchemeSS').href = "colorSchemes/" + selectedColor + ".css";
		setColorScheme(selectedColor);
	}
	
	hidePopup('color_pick');
}

function changeLiteLanguage()
{
	var selectedLang = getCheckedHighlight();
	alert(selectedLang);	
	hidePopup('syntax_lang');
}

function getCheckedColorScheme()
{
	for (var i=0; i < document.changeColorForm.color.length; i++)
	{
		if (document.changeColorForm.color[i].checked)
		{
			return document.changeColorForm.color[i].value;
		}
	}
	return "";
}

function getCheckedHighlight()
{
	for (var i=0; i < document.changeSyntaxLangForm.synLang.length; i++)
	{
		if (document.changeSyntaxLangForm.synLang[i].checked)
		{
			return document.changeSyntaxLangForm.synLang[i].value;
		}
	}
}

function setColorScheme(paramColor){
	new Ajax.Request('./handlers/setColorScheme.php?color='+paramColor, {
		method:'get'
	});
}