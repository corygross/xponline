/*
 *  chat.js
 *	Author: Ron Tolliver
 *	Purpose: Client-side ajax functionality for chat
 */

//Create the Comet "object"
var Comet = Class.create();
		
//Define and set the properties and methods of the class
Comet.prototype = {
		url:'./server2.php',	
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
					//Don't know if we need to do anything here or not
				},
				//When the request is completed
				onComplete:function()
				{
					//Immediately reconnect
					this.comet.connect();  //Connect immeidietly after disconnect (e.g. long polling!)
				},
				//While data is being returned
				onInteractive:function(transport)
				{
					var elements = Form.getElements('theForm');
					elements[0].value = "";
					elements[0].value = transport.responseText;
					var curResponse = transport.responseText;	//Maybe use this later
					transport.responseText = ""; //clear responsetext, or at least make it less obnoxious
				},
				//If there is an error along the way
				onError:function()
				{
					alert("Insert helpful error message here! (and possibly some logging to the server)");
				}
				}
				);
				this.ajax.comet=this;
			},
		//Actions performed when the form is submitted
	  	doRequest: function(request)
		{
			var elements = Form.getElements('theForm');
			elements[1].value = '';
			var input = $('theForm').getInputs('text');
			$('theForm').request(
				{
					method:'get',
					parameters:{input:request},
					onInteractive:function(transport){elements[0].value = ""; elements[0].value = transport.responseText; },
					onComplete:function(){this.comet.connect();}
				})
			}
		}
	  var comet = new Comet();
	  //comet.connect(); 
