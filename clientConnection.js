// This function makes the XML response into an array, then delegates which functions 
// should work with which portions of the response
function handleXMLResponse( response ){
	var XMLobj = Xparse(response);
	for( i=0; i<XMLobj.contents.length; i++){
		if( XMLobj.contents[i].name == "chat" ){
			handleChatResponse(XMLobj.contents[i]);		
		}
		else if( XMLobj.contents[i].name == "docUpdates" ){
			handleUpdateResponse(XMLobj.contents[i]);
		}
		else if( XMLobj.contents[i].name == "locks" ){
			handleLockResponse(XMLobj.contents[i]);
		}
		else if( XMLobj.contents[i].name == "pendingButton" ){
			updatePendingContactButton(XMLobj.contents[i].contents[0].value);
		}
		else if( XMLobj.contents[i].name == "contactList" ){
			contactListUpdate(XMLobj.contents[i].contents[0].value);
		}
	}
}

// Take the array document updates...
function handleUpdateResponse( updateArray ){
	for( var i=0; i < updateArray.contents.length; i++ )
	{
		//this isn't the update id I really want... I want the document specific one
		var updateID = updateArray.contents[i].contents[0].contents[0].value;
		var action = updateArray.contents[i].contents[1].contents[0].value;
		var lineNum = updateArray.contents[i].contents[2].contents[0].value;
		var lineText = updateArray.contents[i].contents[3].contents[0].value;

		// Its a line update
		if(action == "u"){
			XPODoc.updateToServer = false;
			XPODoc.setLineText(lineNum, lineText);
			XPODoc.renderUpdates( cursorLine, cursorColumn );			
			XPODoc.updateToServer = true;
		}
		// A line insert
		else if(action == "i"){
			XPODoc.updateToServer = false;
			XPODoc.insertLine(lineNum, lineText);
			// If a new line is inserted above our cursor, we need to move the cursor down
			if(lineNum < cursorLine){ cursorLine++; }
			XPODoc.renderUpdates( cursorLine, cursorColumn );
			XPODoc.updateToServer = true;
		}
		// A line delete
		else if(action == "d"){
			XPODoc.updateToServer = false;
			XPODoc.removeLine( lineNum );
			// If a line is deleted above our cursor, we need to move the cursor up
			if(lineNum < cursorLine){ cursorLine--; }
			XPODoc.renderUpdates( cursorLine, cursorColumn );
			XPODoc.updateToServer = true;				
		}
		// A notification from another user
		else if(action == "n"){
			alert("Notification: " + lineText);
		}
	}
}

// Take the array of line locks and get the document to lock them
function handleLockResponse( lockArray ){
	var newLockArray = new Array();
	for( var i=0; i < lockArray.contents.length; i++ )
	{
		// Add line locks to our array
		// Line locks have the line number that needs to be locked as well as the user that is on that line
		newLockArray.push(new lockItem(lockArray.contents[i].contents[1].contents[0].value, lockArray.contents[i].contents[2].contents[0].value));
	}	
	lockLines(newLockArray);
}

/////////////////////////////////////////////////////
/////////////////// lockItem object ////////////////////
function lockItem(paramLineID, paramUserName)
{
	this.lineID = paramLineID;
	this.userName = paramUserName;
}


// Create the Comet "object"
var Comet = Class.create();

// If this is the first one, set the init flag so the server knows
var isInit = true;

// Set the properties and methods of the class
Comet.prototype = {
	url:'serverConnection.php',
	noerror:true,
	initialize: function(){},
	// Define the connection function
	connect:function()
	{
		var params = "?init="+isInit;
		isInit = false;
		if( typeof(XPODoc) != "undefined" ){
			params += "&dID="+XPODoc.documentID;
		}
		//Create the AJAX object that inititiate the ajax connection
		this.ajax = new Ajax.Request(this.url+params, 
			{
				method:'get',
				// On a successful response 
				onSuccess:function(transport)
				{		
					if(transport.responseText != "")
					{
						//alert(transport.responseText);
						handleXMLResponse(transport.responseText);
						transport.responseText = "";
					}					
				},				
				// When the request is completed
				onComplete:function()
				{
					// Immediately reconnect
					this.comet.connect();  // Connect immeidietly after disconnect (e.g. long polling!)
				},
				// If there is an error along the way
				onError:function()
				{
					alert("Connection error");
				}
			}
		);
		this.ajax.comet=this;	
	}
}

// Create the comet instance so we can connect on init()
var comet = new Comet();