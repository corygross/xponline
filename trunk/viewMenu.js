function changeColorScheme()
{
	var selectedColor = getCheckedColorScheme();
	alert(selectedColor);
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

