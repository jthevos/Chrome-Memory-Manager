/* Coded by John G Thevos */

// tracking asyncs
var async_count = 0;
var has_processes = false;
var done = false;

var tab_count_derived = 0;

// Master Tabs array - to be populated with JSON objects
var Tabs = new Array();


// Object attribute array declaration
var process_tabs = new Array();
var tab_Ids = new Array();
var tab_titles = new Array();
var tab_urls = new Array();
var tab_mems = new Array();


// HTML Handlers
var bodyNode = document.getElementsByTagName("body");
var olNode = document.getElementsByTagName("ol");


// execute
testListener(); 

getRemainingMemory();

pushObjects(process_tabs,tab_Ids,tab_titles,tab_mems);

viewObjects(Tabs);

// Function List

function testListener() {

	chrome.processes.onUpdatedWithMemory.addListener(function(processes) {
		/* This adds an event listener but as far as I can tell, there's 
		no way to remove it. As such it will keep executing the callback 
		function approx every second, starting the whole cascade again.
		I get around this by using a boolean to see if I have one and only one
		set of processes. Now, I only execute my series of callbacks once, thus 
		giving me the "snapshot" I'm looking for. */

		if (has_processes === false) {
			has_processes = true;
			getProcessId(processes);
			getAllocatedMemory(processes);
			//Object.observe(processes);
			console.dir(processes.jsMemoryAllocated);

		}
	});
}


function getProcessId(processes) {
	
	console.dir("process funciton line 1");

	for (var key in processes) {
		if (processes.hasOwnProperty(key)) {

			// if the process has an associated array, it will return Array(1)
			if (processes[key].tabs.length == 1) {
				tab_count_derived++;
				pushProcessIds(processes[key].osProcessId);
				pushTabIds(processes[key].id);
				pushTitles(processes[key].title);
				
				//getAllocatedMemory(processes[key].osProcessId);

				console.dir(process_tabs);

			}

		}
	}
	
}

// testing two ways of getting memory neither are properly working yet

function getAllocatedMemory(procs) {
	console.dir("Allocated memory test 1");
	for (var key in procs) {
		console.dir("Allocated memory test 2");
		if (procs.hasOwnProperty(key)) {
			console.dir("Allocated memory test 3")
			if (procs[key].tabs.length == 1) {
				console.dir("Got Tab");

				chrome.processes.getProcessInfo(procs[key].osProcessId, true, function(process) { 
					console.dir("test processInfo callback")
					tab_mems.push(process.jsMemoryAllocated);
					console.dir(process.jsMemoryAllocated);
				});

			}

		}
	}
}

function getAllocatedMemory2(processId) {
	console.dir("getAllocatedMemory check 1");
	console.dir(processId);

	chrome.processes.getProcessInfo(processId, true, function(process) {
		//return process.jsAllocatedMemory;
		console.dir("getAllocatedMemory check 2");	
		console.dir(process);
		console.dir(process.jsAllocatedMemory);
		for (var key in process) {
			console.dir("getAllocatedMemory check 3");	
			if (process.hasOwnProperty(key)) {
				console.dir("getAllocatedMemory check 4");	
				tab_mems.push(process[key].jsAllocatedMemory);
				console.dir(process[key].jsAllocatedMemory);
				async_count++;
				if (async_count == process_tabs.length) {
					console.dir("yippee");
					return tab_mems;
			}
			 
		}
	}
	});
}

// array handling for a cleaner getProcessId()

function pushProcessIds(proc) {
	process_tabs.push(proc);
	//console.dir("Process Ids:")
}

function pushTabIds(tab) {
	tab_Ids.push(tab.id);
	//console.dir("Tab Ids:")
}

// because I'm getting the titles from the task manager, all tabs will start with "Tab: "
// The substring() function solves that for me.

function pushTitles(title) {
	var old_title = title;
	var new_title = old_title.substring(5);
	console.dir(new_title);
	tab_titles.push(new_title);
}
					

function constructObject() {
	Tabs.push({"proc_id": "", "tab_id": "", "tab_title": "", "url": "", "allocd_mem": ""});
}

function pushObjects(procs,ids,titles) { //re-add url
	for (var i = 0; i < Tabs.length; i++) {
		constructObject();

		Tabs[i].proc_id = procs[i];
		console.dir(Tabs[i].proc_id);

		Tabs[i].tab_id = ids[i];
		console.dir(Tabs[i].tab_id);

		Tabs[i].tab_title = titles[i];
		console.dir(Tabs[i].tab_title);

		//Tabs[i].url = urls[i];
		//console.dir(Tabs[i].proc_id);

		//Tabs[i].allocd_mem = mems[i];
		//console.dir(Tabs[i].allocd_mem);
	}
}

function getUrls(tabs) {
	//get URL from tab ID
}

function kill(tab_Id) {
	chrome.tabs.remove(tab_Id);
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

function viewObjects(obj_array) {
	for (var i = 0; i < obj_array.length; i++) {
		console.dir("Object " + i + " Proc_Id: "+ obj_array[i].proc_Id);
		console.dir("Object " + i + " Tab Id: "+ obj_array[i].tab_Id);
		console.dir("Object " + i + " Tab Title: "+ obj_array[i].tab_title);
		//console.dir("Object " + i + " url: "+ obj_array[i].url);
		
		console.dir("Object " + i + " allocd_mem: "+ obj_array[i].allocd_mem);
	}
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






















