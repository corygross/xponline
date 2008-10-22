function addBM(windowID){
	var text = document.getElementById('bmText').value;
	var newBM = get_bm_value() + ": " + text;
	//XPODoc.insertLine(getCursorLine(), newBM);	
	alert(newBM);
	hidePopup(windowID);
}

function get_bm_value()
{
	for (var i=0; i < document.addBMForm.bmType.length; i++)
	{
	if (document.addBMForm.bmType[i].checked)
		{
			return document.addBMForm.bmType[i].value;
		}
	}
}

function goToBM(windowID){
	if( gotoLine != -1){
		alert('goto line: ' + gotoLine);
		hidePopup(windowID);
	}
	else{
		alert('Please select a bookmark!');
	}
}

var selectedBM = null;
var gotoLine = -1;
function selectBM(obj, line){
	if(selectedBM != null){
		selectedBM.className = "bm";
	}
	obj.className = "bm_selected";	
	selectedBM = obj;
	gotoLine = line;
}