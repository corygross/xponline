function accessMenuClick()
{
	openPopup('grantAccess','Grant User Access','grantAccess');
	getWritableDocs();
}

function addBookmarkMenuClick()
{
	openPopup('add_bm','Add Bookmark','addBM');
}

function changeDocTitle(title)
{
	document.getElementById('fileName').innerHTML = title;
	document.title = "XPonline | " + title;
}

function colorMenuClick()
{
	openPopup('color_pick','Color Scheme','color');
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

function exitMenuClick()
{
	window.location = "logout.php";
}

var bookmarkArray;
function findBookmarkMenuClick()
{
	bookmarkArray = XPODoc.document.findAllBookmarks();
	openPopup('find_bm','Find Bookmark','findBM');
}

function findMenuClick()
{
	openPopup('find_text','Find','find_text');
}

function hidemenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="hidden";
}

function highlighMenuClick()
{
	alert("highlight");
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