/* Coded by John G Thevos */

// tracking asyncs
var async_count = 0;
var accepting_calls = true;
var done = false;

// tracking syncs to know when to generate html
var literal_tab_count = getLiteralTabCount();
//console.dir(literal_tab_count);
//console.dir(Tabs.length);
// Master Tabs array - to be populated with JSON objects
var Tabs = new Array();


// execute
exectuteAsyncLogic(); 
//getRemainingMemory(); //get total memory - this is synchronous 


// Function List
function constructObject(proc,tab,titl,mem) {
	Tabs.push({"proc_id": proc, "tab_id": tab, "tab_title": titl, "allocd_mem": mem});
	async_count++;
}
	
function exectuteAsyncLogic() {
	chrome.processes.onUpdatedWithMemory.addListener(function(procs) {
/* This adds an event listener but as far as I can tell, there's no way to remove it. As such it 
will keep executing the callback function approx every second, starting the whole cascade again.
I get around this by using a boolean to see if I have one and only oneset of processes. Now, I only 
execute my series of callbacks once, thus giving me the "snapshot" I'm looking for. */
		if (accepting_calls === true) {
			accepting_calls = false;

			console.dir(procs);
			console.debug("Check 1");

/* This is my way of "drilling down". procs is a dictionary of process objects, and once i have
those objects, I need to analyze them and see what kind of process it is. I learned from debugging 
that procs[key] always == "[object Object]". I use this to drill down to the objects themselves. */

			for (var key in procs) {
				if (procs.hasOwnProperty(key)) {
					if (procs[key] == "[object Object]") { 
						console.dir(procs[key].privateMemory);
						extractInfo(procs[key]); // get all relevant information
					}
				}
			}
			done = true;
			console.dir(Tabs);
			exectueSyncLogic();
		}
	});
}

function extractInfo(object_index) {
	//previously using if (object_index.type == "renderer") {...}
	// but there are non-tab processes that can be of of type renderer.
	// As such, detecting an Array of length 1 means for certain I have a tab. 

	if (object_index.tabs.length > 0) {
		console.debug("extract Info Test 1");
		for (var key in object_index.tabs) { // will always execute one time only
			console.debug("extract Info Test 2");

			constructObject(object_index.osProcessId, 
					object_index.tabs[key],  // goes into the tab array of the process and pulls tab_id
					clipTitle(object_index.title), 
					object_index.privateMemory);

			console.dir(object_index.jsMemoryAllocated);
		}
	}
}


function clipTitle(title) {
// because I'm getting the titles from the task manager, all tabs will start with "Tab: "
// The substring() function solves that for me.
	var old_title = title;
	var new_title = old_title.substring(5);
	return new_title;
}
					

// functioning sort for my objects
// if asc == false, it will sort in descending order

function sortResults(prop, asc) {
    Tabs = Tabs.sort(function(a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
    console.dir(Tabs);
}

function exectueSyncLogic() {
	if (done === true) {
		chrome.system.memory.getInfo(function(info) {
			var tot_mem = formatSizeUnits(info.capacity);
			var avail_mem = formatSizeUnits(info.availableCapacity);

			//
			sortResults("allocd_mem", false);

			document.getElementById('wrapper').appendChild(createDOMTable(Tabs,tot_mem,avail_mem));	
		});
	}
}

function getUrl(tab_Id) {
	chrome.tabs.get(tab_Id, function(tab) {
		console.debug(tab.url);
		return tab.url;
	});
}


function kill(tab_Id) {
	chrome.tabs.remove(tab_Id, function(didTerminate) {
		console.dir("kill function called");
		if (didTerminate) {
			//Tabs.length = 0;
			//accepting_calls = true; // these two booleans will act as a "refresh"
			//done = false;
			console.debug("successfully terminated");
			//document.getElementById("display").deleteRow(html_index);
		}
	});
}

/*
function favorite(tab_Id) {
	 chrome.bookmarks.create({
	 	'parentId': null,
        'title': tab_title,
        'url': url};
        //, kill(tab_Id); 
}
*/	

function testKeys(processes) {

	var x = Object.getOwnPropertyNames(processes);
	var y = Object.keys(processes);

	for (var i = 0; i < y.length; i++) {
		console.dir(y[i]);
	}
}


function getAvailableMemory() {
	chrome.system.memory.getInfo(function(info) {
		return info.availableCapacity;
	});
}

function getTotalMemory() {
	chrome.system.memory.getInfo(function(info) {
		return info.capacity;
	});
}

function createDOMTable(obj_array,mem1,mem2) {

	var body = document.createElement('body');

	var h2 = document.createElement('h2');
	h2.appendChild(document.createTextNode("Memory Management"));
	var h3a = document.createElement('h3');
	h3a.appendChild(document.createTextNode("Total Capacity: " + mem1));

	var h3b = document.createElement('h3');
	h3b.appendChild(document.createTextNode("Available Capacity: " + mem2));


	body.appendChild(h2);
	body.appendChild(h3a);
	body.appendChild(h3b);
    // Create the list element:
    var table = document.createElement('table');
    table.id = "display";
    var first_tr = document.createElement('tr');

	var first_td = document.createElement('td');
	var sec_td = document.createElement('td');
	var trd_td = document.createElement('td');
	var bttn_td = document.createElement('td');

    first_td.appendChild(document.createTextNode(""));
    sec_td.appendChild(document.createTextNode("Tab Title"));
    trd_td.appendChild(document.createTextNode("Allocated Memory"));
    bttn_td.appendChild(document.createTextNode("Close"));

    first_tr.appendChild(first_td);
    first_tr.appendChild(sec_td);
    first_tr.appendChild(trd_td);
    first_tr.appendChild(bttn_td);

    table.appendChild(first_tr);

    for(var i = 0; i < obj_array.length; i++) {

    	var kill_value = obj_array[i].tab_id;
    	console.dir(kill_value);
    	console.dir(obj_array[i].tab_title);
        // Create the table row and content values:
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');

        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        //var td4 = 'button'+ i;
        var td4 = document.createElement('td');
        var bttn = document.createElement("button");
        bttn.setAttribute("name",obj_array[i].tab_id);
        // Set its contents:
        td1.appendChild(document.createTextNode(i+1));
        td2.appendChild(document.createTextNode(obj_array[i].tab_title));
        td3.appendChild(document.createTextNode(formatSizeUnits(obj_array[i].allocd_mem)));

        td4.appendChild(bttn);
        //td4.setAttribute("name",obj_array[i].tab_id);


        bttn.addEventListener("click", function() {
        	kill(parseInt(this.getAttribute("name")));
        }, false);

        // Add it to the list:
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        table.appendChild(tr);
    }

    body.appendChild(table);

    // Finally, return the constructed fully contructed body:
    return body;
}

function formatSizeUnits(bytes){
	if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
	else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
	else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
	else if (bytes>1)           {bytes=bytes+' bytes';}
	else if (bytes==1)          {bytes=bytes+' byte';}
	else                        {bytes='0 bytes';}
	return bytes;
}

function getLiteralTabCount() {
	var count = 0;

	chrome.windows.getAll({populate: true}, function(windows)
	{
		for (var i = 0; i < windows.length; i++) {
			for (var j = 0; j < windows[i].tabs.length; j++) {
				count++;
			}	
		}
		return count;
	});
}