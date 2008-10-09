//create the http request object
createObject = function() {
	var request_type;
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer"){
	request_type = new ActiveXObject("Microsoft.XMLHTTP");
	}else{
		request_type = new XMLHttpRequest();
	}
		return request_type;
}

var http = createObject();

//The function that calls the server to search
var selectedItem = -1;
var lastSearch = "";
autosuggest = function(ev) 
{
q = document.getElementById('search-q').value;

//Clear the current selected user if something changed
if(lastSearch != q.trim())
{
    //userChange("","");
	selectContact("","");
}

var listHidden = document.getElementById('results').style.display == "none";
var key = getKey(ev);

if(key == '40' && listHidden == false)
{  
    if(document.getElementById("item"+(selectedItem+1)))
    {    
        document.getElementById("item"+(selectedItem+1)).className = "highlight";
        selectedItem++;
        if(document.getElementById("item"+(selectedItem-1)))
        {
            document.getElementById("item"+(selectedItem-1)).className = "";
        }
    }

    return;
}
if(key == '38' && listHidden == false)
{
    if(selectedItem != 0 && selectedItem != -1)
    {
        document.getElementById("item"+selectedItem).className = "";
        selectedItem--;
        document.getElementById("item"+selectedItem).className = "highlight";        
    }
    return;
}
if((key == '9' || key == '13') && listHidden == false)
{
	selectItemByKeyPress();
    return;
}

if(lastSearch == q.trim())
{
    return;
}
else
{
    lastSearch = q = q.trim();
}

if(q.length < 1)
{
    document.getElementById('results').style.display = "none";
    return;
}

// Set te random number to add to URL request
nocache = Math.random();
http.open('get', 'controls/contact_search/search_contacts.php?q='+q+'&nocache = '+nocache);
http.onreadystatechange = autosuggestReply;
http.send(null);
}

autosuggestReply = function() {
if(http.readyState == 4){
    selectedItem = -1;
	var response = http.responseText;
	e = document.getElementById('results');
	if(response!=""){
		e.innerHTML=response;
		e.style.display="block";
	} else {
		e.style.display="none";
	}
}
}

selectItem = function(name, id)
{
    document.getElementById('search-q').value = name;
    document.getElementById('results').style.display = "none";
	//userChange(name, id);
	selectContact(id, name);
}

selectItemByKeyPress = function()
{
        if(selectedItem != -1)
        {
			var data_arr = document.getElementById("item"+selectedItem).title.split("^*");;
			document.getElementById('search-q').value = data_arr[0];
            document.getElementById('results').style.display = "none";
			//userChange(data_arr[0],data_arr[1]);
			selectContact(data_arr[1],data_arr[0]);
        }
}

checkTabKey = function(ev)
{
    var key = getKey(ev);    
    var listHidden = document.getElementById('results').style.display == "none";
    
    if(key == '9' && listHidden == false)
    {
		selectItemByKeyPress();
        return false;
    }
}

getKey = function(ev) 
{
	var code;
	var e = ev || window.event;

	if (e.keyCode) 
	{
	    code = e.keyCode;
	}
	else if (e.which) 
	{
	    code = e.which;
	}
	return code;
}

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

//document.getElementById('search-q').focus();