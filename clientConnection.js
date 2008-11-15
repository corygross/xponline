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
	}
}

// Take the array document updates...
function handleUpdateResponse( updateArray ){
	for( var i=0; i < updateArray.contents.length; i++ )
	{
		//this isn't the update id I really want... I want the document specific one
		var updateID = updateArray.contents[i].contents[0].contents[0].value;
//alert(updateID);
		var lineNum = updateArray.contents[i].contents[2].contents[0].value;
		var lineTextObj = updateArray.contents[i].contents[3].contents[0];
		var lineText = "";
		if( typeof(lineTextObj) != "undefined" ){
				lineText = lineTextObj.value;
		}
		//var lineText = updateArray.contents[i].contents[2].contents[0].value;

		// Its a line update
		if(updateArray.contents[i].contents[1].contents[0].value == "u"){
			XPODoc.updateToServer = false;
			XPODoc.setLineText(lineNum, lineText);			
			XPODoc.updateToServer = true;
			clearFormatting(lineNum);
		}
		// A line insert
		else if(updateArray.contents[i].contents[1].contents[0].value == "i"){
			XPODoc.updateToServer = false;
			XPODoc.insertLine(lineNum, lineText);
			XPODoc.updateToServer = true;

			var addMe = guiDoc.createElement('div');
			addMe.setAttribute('id', XPODoc.getLineId( lineNum ) );
			addMe.setAttribute('class', "line");
			lineNum = parseInt(lineNum);
			lineNum++;
			guiDoc.getElementById("entireDocument").insertBefore( addMe, guiDoc.getElementById( XPODoc.getLineId( lineNum ) ) );
			clearFormatting( lineNum );
		}
		// A line delete
		else if(updateArray.contents[i].contents[1].contents[0].value == "d"){
			var removeMe = guiDoc.getElementById(XPODoc.getLineId( lineNum ));
			removeMe.parentNode.removeChild(removeMe);
			
			XPODoc.updateToServer = false;
			XPODoc.removeLine( lineNum );
			XPODoc.updateToServer = true;				
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


//Create the Comet "object"
var Comet = Class.create();

//Set the properties and methods of the class
Comet.prototype = {
	url:'serverConnection.php',
	noerror:true,
	initialize: function(){},
	//Define the connection function
	connect:function()
		{
			var params = "";
			if( typeof(XPODoc) != "undefined" ){
				params = "?dID="+XPODoc.documentID;
			}
			//Create the AJAX object that inititiate the ajax connection
			this.ajax = new Ajax.Request(this.url+params, 
				{
					method:'get',
					//On a successful response 
					onSuccess:function(transport)
					{		
						//if(isFF == false && transport.responseText != "")
						if(transport.responseText != "")
						{
							//alert(transport.responseText);
							handleXMLResponse(transport.responseText);
							transport.responseText = "";
						}					
					},				
					//When the request is completed
					onComplete:function()
					{
						//Immediately reconnect
						this.comet.connect();  //Connect immeidietly after disconnect (e.g. long polling!)
					},
					//Make sure we are printing messages as they come from the server
					onInteractive:function(transport)
					{
						/*
						if(isFF == true && transport.responseText != "")
						{
							//alert("interactive"+transport.responseText);
							handleXMLResponse(transport.responseText);
							transport.responseText = "";
						}*/
					},
					//If there is an error along the way
					onError:function()
					{
						alert("Error");
					}
				}
			);
			this.ajax.comet=this;
		
		},
		handleResponse: function(response)
		{
		  //$('content').innerHTML += '<div>' + response['msg'] + '</div>';
		}
}

//create the comet instance and connect
var comet = new Comet();
comet.connect();