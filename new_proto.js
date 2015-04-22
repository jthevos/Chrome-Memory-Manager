/* Coded by John G Thevos */

// tracking asyncs
var async_count = 0;
var accepting_calls = true;

// tracking syncs to know when to generate html
var literal_tab_count = getLiteralTabCount();
console.dir(literal_tab_count);
//console.dir(Tabs.length);
// Master Tabs array - to be populated with JSON objects
var Tabs = new Array();


// execute
exectuteAsyncLogic(); 
getRemainingMemory(); //get total memory - this is synchronous 

if (Tabs.length == literal_tab_count) {
	console.debug("DOM test");
	document.getElementById('wrapper').appendChild(makeUL(Tabs));
}



// Function List
function constructObject(proc,tab,titl,mem) {
	Tabs.push({"proc_id": proc, "tab_id": tab, "tab_title": titl, "url": "", "allocd_mem": mem});
}
	
function exectuteAsyncLogic() {
	chrome.processes.onUpdatedWithMemory.addListener(function(procs) {
/* This adds an event listener but as far as I can tell, there's 
no way to remove it. As such it will keep executing the callback 
function approx every second, starting the whole cascade again.
I get around this by using a boolean to see if I have one and only one
set of processes. Now, I only execute my series of callbacks once, thus 
giving me the "snapshot" I'm looking for. */
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
						extractInfo(procs[key]); // get all relevant information
					}
				}
			}
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
					object_index.jsMemoryAllocated);
		}

		async_count++;
	}
	if (Tabs.length == async_count) {
		//insertionSort(Tabs);
	}
	//console.dir(Tabs);
}


function clipTitle(title) {
// because I'm getting the titles from the task manager, all tabs will start with "Tab: "
// The substring() function solves that for me.
	var old_title = title;
	var new_title = old_title.substring(5);
	return new_title;
}
					

function insertionSort(obj_array) {

    var value, i, j;                    // the value currently being compared   
    for (i=0; i < obj_array.length; i++) {
        value = obj_array[i].allocd_mem;
        for (j=i-1; j > -1 && obj_array[j].allocd_mem > value; j--) {
            obj_array[j+1] = obj_array[j];
        }
        obj_array[j+1] = value;
    }
    return obj_array;
}

function getUrls(tabs) {
	//get URL from tab ID - these are synchronous so I need to map it later
}

function kill(tab_Id) {
	chrome.processes.terminate(tab_Id, function(didTerminate) {
		if (didTerminate) {
			console.debug("termination of " + tab_Id + " successful.");
			// has process = false; to restart the listener
		}
	});
}

/*
function favorite(tab_Id, tab_title, url) {
	 chrome.bookmarks.create({
	 	'parentId': null,
        'title': tab_title,
        'url': url};
        //, kill(tab_Id); 
}*/
	

function testKeys(processes) {

	var x = Object.getOwnPropertyNames(processes);
	var y = Object.keys(processes);

	for (var i = 0; i < y.length; i++) {
		console.dir(y[i]);
	}
}


function getRemainingMemory() {
	chrome.system.memory.getInfo(function(info) {
		console.dir("Availably capabity in bytes: "+ info.availableCapacity);
		console.dir("Total capabity in bytes: "+ info.capacity);
	});
}


function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i].tab_title));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
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