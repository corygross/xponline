function accessMenuClick()
{
	openPopup('grantAccess','Grant User Access','grantAccess');
	getWritableDocs();
	document.getElementById('search-q').focus();
}

function addBookmarkMenuClick()
{
	if(documentIsOpen() == false){
		alert("Please open a document to add a bookmark.");
		return;
	}
	openPopup('add_bm','Add Bookmark','add_bm');
}

function changeDocTitle(title)
{
	document.getElementById('fileName').innerHTML = title;
	if(title == ""){
		document.title = "XPonline";
	}
	else{
		document.title = title + " | XPonline";
	}
}

function closeMenuClick()
{
	closeDocument();
}

function colorMenuClick()
{
	openPopup('color_pick','Color Scheme','color_pick');
}

function copyIconClicked()
{
	alert("copy");
}

function cutIconClicked()
{
	alert("cut");
}

function deleteMenuClick()
{
	openPopup('delete_doc','Delete a Document','delete_doc');
	getDeletableDocs();
	return;
}

function downloadMenuClick()
{
	alert("download");
}

function syntaxHighlightingToggle()
{
	//This should just be a general on/off toggle switch
	//The current file type should dictate the type of 
	//syntax highlighting applied
//	document.getElementById('ss');
	//testFunction();
	var testVar = document.getElementById('SS');
	alert(testVar);
	toggleSyntaxHighlight();
}
function exitMenuClick()
{
	window.location = "logout.php";
}

var bookmarkArray;
function findBookmarkMenuClick()
{
	if(documentIsOpen() == false){
		alert("Please open a document find bookmarks.");
		return;
	}
	bookmarkArray = XPODoc.document.findAllBookmarks();
	openPopup('find_bm','Find Bookmark','find_bm');
}

function findMenuClick()
{
	if(documentIsOpen() == false){
		alert("Please open a document to find text in.");
		return;
	}
	openPopup('find_text','Find','find_text');
	document.getElementById('textToFind').focus();
}

function gotoMenuClick()
{
	if(documentIsOpen() == false){
		alert("Please open a document first.");
		return;
	}
	openPopup('goto_window','Go To Line','goto_window');
	document.getElementById('gotoLineInput').focus();	
}

function hidemenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="hidden";
}

function highlighMenuClick()
{
	toggleSyntaxHighlighting();

/*	var testVar = getDoc().getElementById('SS').href;
	if(testVar.indexOf("java.css") == -1)
	{
		getDoc().getElementById('SS').href = "../java.css"; return;
	}
	getDoc().getElementById('SS').href = "../style.css";
*/
	//	alert(testVar);
	//openPopup('syntax_lang','Highlight Language','syntax_lang');
}

function newMenuClick()
{
	openPopup('new_blank','New Document','new_blank');
	document.getElementById('newDocName').focus();
}

function openMenuClick()
{
	openPopup('open_doc','Open Document','open_doc');
	getAccessibleDocs();
}

function pasteIconClicked()
{
	alert("paste");
}

function replaceMenuClick()
{
	if(documentIsOpen() == false){
		alert("Please open a document to replace text in.");
		return;
	}
	openPopup('replace_text','Replace','replace_text');
	document.getElementById('replaceTextToFind').focus();
}

function selectAllMenuClick()
{
	alert("select all");
}

function showmenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="visible";
}

var lineCol;
function updateLineCol(line, col)
{
	if(lineCol == null){
		lineCol = document.getElementById('curLineCol');
	}
	if(line == "" && col == ""){
		lineCol.innerHTML = "";
		return;
	}
	lineCol.innerHTML = "Ln:" + line + " Col:" + col;
}

function uploadMenuClick()
{
	//Show the form that will allow for file upload
	openPopup('upload', 'Upload File ', 'upload');	
}