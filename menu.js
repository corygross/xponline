function showmenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="visible";
}

function hidemenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="hidden";
}

function newMenuClick()
{
	alert("new");
	changeDocTitle('newFilename.xml');
}

function openMenuClick()
{
	alert("open");
	changeDocTitle('newFilename.xml');
}

function uploadMenuClick()
{
	alert("upload");
}

function downloadMenuClick()
{
	alert("download");
}

function findMenuClick()
{
	alert("find");
}

function replaceMenuClick()
{
	alert("replace");
}

function selectAllMenuClick()
{
	alert("select all");
}

function colorMenuClick()
{
	openPopup('color_pick','Color Scheme','color');
}

function highlighMenuClick()
{
	alert("highlight");
}

function addBookmarkMenuClick()
{
	openPopup('add_bm','Add Bookmark','addBM');
}

function findBookmarkMenuClick()
{
	openPopup('find_bm','Find Bookmark','findBM');
}

function cutIconClicked()
{
	alert("cut");
}

function copyIconClicked()
{
	alert("copy");
}

function pasteIconClicked()
{
	alert("paste");
}

function changeDocTitle(title)
{
	document.getElementById('fileName').innerHTML = title;
	document.title = "XPonline | " + title;
}

var lineCol;
function updateLineCol(line, col)
{
	if(lineCol == null){
		lineCol = document.getElementById('curLineCol');
	}
	lineCol.innerHTML = "Ln:" + line + " Col:" + col;
}