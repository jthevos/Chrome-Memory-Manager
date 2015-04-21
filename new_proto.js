/* Coded by John G Thevos */

// tracking asyncs
var async_count = 0;
var accepting_calls = true;

// Master Tabs array - to be populated with JSON objects
var Tabs = new Array();

// HTML Handlers for ol population
var bodyNode = document.getElementsByTagName("body");
var olNode = document.getElementsByTagName("ol");


// execute
exectuteLogic(); 
getRemainingMemory(); //get total memory - this is synchronous 


// Function List
function constructObject(proc,tab,titl,mem) {
	Tabs.push({"proc_id": proc, "tab_id": tab, "tab_title": titl, "url": "", "allocd_mem": mem});
}

function exectuteLogic() {
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

	if (object_index.type == "renderer") {

		constructObject(object_index.osProcessId, 
						object_index.id, 
						clipTitle(object_index.title), 
						object_index.jsMemoryAllocated);
		async_count++;
	}
	if (Tabs.length == async_count) {
		//insertionSort(Tabs);
	}
	console.dir(Tabs);
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


function populateHTML(obj_array) {

	console.dir("Test 1");

	for (var i = 0; i < tabs.length; i++) {

		var liNode = document.createElement("li");
		console.dir("li created");

		liNode.innerHTML = obj_array[i].tab_title;

		//var liTextNode = document.createTextNode(obj_array[i].tab_title);
		console.dir("li contents created");

		//liNode.appendChild(liTextNode);
		//console.dir("text appended to li");

		olNode.appendChild(liNode);
		console.dir("li appended to ol");

		bodyNode.appendChild(olNode);
	}	
	console.dir("Test 2");
} 

function addToList(obj_array) {
	liNode.innerHTML = obj_array[i].tab_title;
}