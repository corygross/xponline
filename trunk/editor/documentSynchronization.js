/**********************************************/
/********** DECLARE GLOBAL VARIABLES **********/

// The current update number, to keep updates in order between the client and server
var updateNumber = -1;

// The history of updates made, the last 100
var updateHistory = new Array(100);

// Updates that have not yet been sent to the server
var pendingServerUpdates = new Array();

// The line number that we need to send to the server to lock
var lineLockToSend = -1;

// Any lines that other users currently have locked in the document
var lockedLines = new Array();

/**********************************************/
/************** LINE LOCKING *****************/

// This function highlights and locks lines given by the 'newLineLocks' array it receives
function lockLines( newLineLocks ) {
	// Close the currently open lock popup, so we don't get left with one stuck open
	window.frames.myI.closeLockPopup();

	// Clear the old line locks
	for( var i=0; i < lockedLines.length; i++ )
	{
		lockedLines[i].isLockedBy = null;
		XPODoc.renderLine( -1, cursorLine, cursorColumn, lockedLines[i] );
	}
	
	lockedLines = new Array( newLineLocks.length );
	
	// Add the new line locks
	for( var j=0; j < newLineLocks.length; j++ )
	{		
		XPODoc.lockLine( newLineLocks[j].lineID, newLineLocks[j].userName );
		XPODoc.setLineUpdated( newLineLocks[j].lineID );
		lockedLines[j] = XPODoc.getLineObject( newLineLocks[j].lineID );
	}
	XPODoc.renderUpdates( cursorLine, cursorColumn );
}

// This function sends a waiting line lock to the server periodically
this.sendLineLock = function () {
	if( lineLockToSend != -1 ){	
		var initFlag = "";
		if( typeof(sendLineLock.lockOrderCounter) == "undefined" ){ 
			sendLineLock.lockOrderCounter = 0; 
			initFlag = "&lockInit=true";
		}
		else{
			if( sendLineLock.lockOrderCounter == 499 ) { sendLineLock.lockOrderCounter = 0; }
			else { sendLineLock.lockOrderCounter++; }
		}
		new Ajax.Request("./documents/lineLock/updateLineLock.php?curLine=" + lineLockToSend + "&docID=" + XPODoc.documentID + "&order=" + sendLineLock.lockOrderCounter + initFlag, {
			method:'get'		
		});
		lineLockToSend = -1;
	}
	
	// Every 1 second, see if there is anything to send again
	setTimeout('sendLineLock()', 1000);
}

// This function sets a variable to a line number that needs to be sent to the server as a new line lock.
function updateLineLock( paramLine ) {
	lineLockToSend = paramLine;
}

/**********************************************/
/******** DOCUMENT SYNCHRONIZATION ******/

// This function moves updates that were just sent to the server to the update history array
function moveUpdatesToHistory(){
	for( var i=0; i < pendingServerUpdates.length; i++ )
	{			
		updateHistory[pendingServerUpdates[i].updateNum] = pendingServerUpdates[i];
	}
}

// This function resends updates from the update history if the server requests them
function resendUpdates( paramStartingUpdateNum ){
	// If the server requests an update 1 ahead of our current update number, just ignore it... we have nothing new to send it
	if( paramStartingUpdateNum == updateNumber+1 || (updateNumber == 99 && paramStartingUpdateNum == 0)){		
		return;
	}
	
	// Move pending updates to history so we can send them along with our resend
	moveUpdatesToHistory();

	var updatesToResend;	
	if( updateNumber > paramStartingUpdateNum ){
		updatesToResend = updateHistory.slice(paramStartingUpdateNum, updateNumber+1);		
	}
	else if( updateNumber == paramStartingUpdateNum ){
		updatesToResend = updateHistory.slice(updateNumber, updateNumber+1);
	}
	else{
		updatesToResend = updateHistory.slice(paramStartingUpdateNum);
		updatesToResend.splice(100,0, updateHistory.slice(0,updateNumber));
	}

	sendUpdatesAjax( updatesToResend.toJSON() );
}

// This function actually sends pending document updates to the sever periodically
function sendDocumentUpdates(){

	if(pendingServerUpdates.length > 0){
		sendUpdatesAjax( pendingServerUpdates.toJSON() );
		moveUpdatesToHistory();
		
		// Clear out the array so it doesn't send again.  We should probably also keep a record somewhere of them for awhile
		pendingServerUpdates  = new Array();
	}
	
	// Every 1 second, see if there is anything to send again
	setTimeout('sendDocumentUpdates()', 1000);
}

// This is the actual ajax for sending document updates
this.sendUpdatesAjax = function( paramUpdatesJSON ){
	if( typeof(sendUpdatesAjax.initString) == "undefined" ) sendUpdatesAjax.initString = "init=true";
	else sendUpdatesAjax.initString = "";
	
	new Ajax.Request('./handlers/documentUpdate.php?'+sendUpdatesAjax.initString, {
		method:'post',
		postBody: 'updateData='+paramUpdatesJSON,
		onSuccess: function(transport) {
			if(transport.responseText != ""){
				//alert(transport.responseText);
				var updateResponse = transport.responseText.split("^split&");
				if( updateResponse[0] == "missingUpdateError" ){
					resendUpdates( updateResponse[1] );
				}
				else{
					alert(transport.responseText);
				}
			}
		}		
	});
}

// paramAction: i (insert), u (update), d (delete), n (notify)
// paramText: the new text for the affected line
// paramLineNum: the line where the action will take place
function updateDocument( paramAction, paramText, paramLineNum ) {
	if(readOnly == true) return;

	// Fix the line locks so we can remove them when we get a new batch
	/*
	if(paramAction == "i" || paramAction == "d"){
		for( var i=0; i < lockedLines.length; i++ )
		{			
			if(paramAction == "i" && lockedLines[i].lineID >= paramLineNum){
				lockedLines[i].lineID = parseInt(lockedLines[i].lineID) + 1;
			}
			else if(paramAction == "d" && lockedLines[i].lineID > paramLineNum){
				lockedLines[i].lineID = parseInt(lockedLines[i].lineID) - 1;
			}
		}
	}
	*/
	
	// Replace any ampersands or plus signs for transmission...	
	paramText = paramText.replace(/&/g, "aMPerSand");
	paramText = paramText.replace(/\+/g, "pLUsSign");
	
	// If we have multiple updates to the same line in a row, just use the latest one.
	var arrayLength = pendingServerUpdates.length;
	if(arrayLength > 0){
		var lastUpdateObj = pendingServerUpdates[ arrayLength-1 ];
		if(lastUpdateObj.action == "u" && paramAction == "u" && lastUpdateObj.lineNum == paramLineNum){
			pendingServerUpdates[ arrayLength-1 ] = new updateObject(paramAction, paramText, paramLineNum, lastUpdateObj.updateNum);
			return;
		}
	}
	pendingServerUpdates.push( new updateObject(paramAction, paramText, paramLineNum) );
}

// This will be an 'update' that we will send to the server
function updateObject(paramAction, paramText, paramLineNum, paramUpdateNum){
	this.action = paramAction;
	this.text = paramText;
	this.lineNum = paramLineNum;
	this.documentID = XPODoc.documentID;
	if( paramUpdateNum != null ) this.updateNum = paramUpdateNum;
	else{
		updateNumber++;
		if( updateNumber > 99 ) updateNumber = 0;
		this.updateNum = updateNumber;
	}
}



// On load, wait 5 seconds to start checking to see if we need to send any updates or locks to the server
setTimeout('sendDocumentUpdates()',5000);
setTimeout('sendLineLock()', 5000);