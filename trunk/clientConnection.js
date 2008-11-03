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
		//alert(updateArray.contents[i].contents[1].contents[0].value);
	}	

}

// Take the array of line locks and get the document to lock them
function handleLockResponse( lockArray ){
	var newLockArray = new Array();
	for( var i=0; i < lockArray.contents.length; i++ )
	{
		//below code will output the id of the user that is on the line
		//lockArray.contents[i].contents[0].contents[0].value
		newLockArray[i] = lockArray.contents[i].contents[1].contents[0].value;
	}	
	lockLines(newLockArray);
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
			//Create the AJAX object that inititiate the ajax connection
			this.ajax = new Ajax.Request(this.url, 
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