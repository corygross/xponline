function accessMenuClick()
{
	openPopup('grantAccess','Grant User Access','grantAccess');
	getWritableDocs();
}

function addBookmarkMenuClick()
{
	openPopup('add_bm','Add Bookmark','add_bm');
}

function changeDocTitle(title)
{
	document.getElementById('fileName').innerHTML = title;
	document.title = "XPonline | " + title;
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

function downloadMenuClick()
{
	alert("download");
}

function syntaxHighlightingToggle()
{
//	alert("Toggle Syntax Highlighting");
//	document.getElementById('ss');
	testFunction();
}
function exitMenuClick()
{
	window.location = "logout.php";
}

var bookmarkArray;
function findBookmarkMenuClick()
{
	bookmarkArray = XPODoc.document.findAllBookmarks();
	openPopup('find_bm','Find Bookmark','find_bm');
}

function findMenuClick()
{
	openPopup('find_text','Find','find_text');
}

function gotoMenuClick()
{
	openPopup('goto_window','Go To Line','goto_window');
}

function hidemenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="hidden";
}

function highlighMenuClick()
{
	openPopup('syntax_lang','Highlight Language','syntax_lang');
}

function newMenuClick()
{
	openPopup('new_blank','New Document','new_blank');
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
	alert("replace");
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
	lineCol.innerHTML = "Ln:" + line + " Col:" + col;
}

function uploadMenuClick()
{
	//Show the form that will allow for file upload
	openPopup('upload', 'Upload File ', 'upload');
}