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
}

function openMenuClick()
{
	alert("open");
}

function uploadMenuClick()
{
	alert("upload");
}

function downloadMenuClick()
{
	alert("download");
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