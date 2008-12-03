var cut_copy_text;

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
	if( XPODoc.isSelection != false ){
		var selection = XPODoc.getCurrentSelection();
		cut_copy_text = XPODoc.getTextInRange(selection.startLine, selection.startColumn, selection.endLine, selection.endColumn, 0);
	}
	giveDocumentFocus();
}

function cutIconClicked()
{	
	if( XPODoc.isSelection != false ){
		var selection = XPODoc.getCurrentSelection();
		XPODoc.clearCurrentSelection();
		cut_copy_text = XPODoc.getTextInRange(selection.startLine, selection.startColumn, selection.endLine, selection.endColumn, 0);
		XPODoc.replaceTextInRange(selection.startLine, selection.startColumn, selection.endLine, selection.endColumn, "");
		if( selection.startLine <= selection.endLine ) setCursor( selection.startLine, selection.startColumn );
		else setCursor( selection.endLine, selection.endColumn );
		XPODoc.renderUpdates( cursorLine, cursorColumn );
	}
	giveDocumentFocus();
}

function deleteMenuClick()
{
	openPopup('delete_doc','Delete a Document','delete_doc');
	getDeletableDocs();
	return;
}

function downloadMenuClick()
{
	if(typeof(XPODoc.documentID) != "undefined" && XPODoc.documentID != ""){
		$('super_form').action = "./handlers/downloadDocument.php?dID=" + XPODoc.documentID;
		$('super_form').submit();
	}
	else{
		alert("You must first open the document you want to download.");
	}
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
	if( typeof(cut_copy_text) != "undefined" ){
		var endCoords = XPODoc.insertText( cut_copy_text, cursorLine, cursorColumn );
		setCursor( endCoords[0], XPODoc.getLineLength( endCoords[0] ) );
		XPODoc.setLineUpdated( cursorLine+1 );
		XPODoc.renderUpdates( cursorLine, cursorColumn );
	}
	giveDocumentFocus();
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
	var lastLine = XPODoc.getDocumentLength() - 1;
	var lastCol = XPODoc.getLineLength( lastLine );
	XPODoc.setCurrentSelection( 0, 0, lastLine, lastCol );
	setCursor( lastLine, lastCol );
	XPODoc.renderEntireDocument( lastLine, lastCol );	
	giveDocumentFocus();
}

function showmenu(elmnt)
{
    document.getElementById(elmnt).style.visibility="visible";
}

var lineCol = null;
function updateLineCol(line, col)
{
	if(lineCol == null){
		lineCol = document.getElementById('curLineCol');
	}
	
	if(line !== "" || col !== ""){lineCol.innerHTML = "Ln:" + line + " Col:" + col; return;}
	else { lineCol.innerHTML = ""; return; }
}

function uploadMenuClick()
{
	//Show the form that will allow for file upload
	openPopup('upload', 'Upload File ', 'upload');	
}