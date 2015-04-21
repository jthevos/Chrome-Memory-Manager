# Chrome-Memory-Manager
This extension is only functional on the developer channel of chrome. chrome://version/ shows you your current channel. Visit http://www.chromium.org/getting-involved/dev-channel to change your version. 

This code is designed to be an in-client memory mangement system. The javascript will take a snapshot of the users current tabs across all windows, capturing all live processes currently running on Chrome's internal task manager. From these processes, I then build an array of JSON Objects with defined properties.

This code is attempting to create several instences of a JSON Object, Tab, with the captured information from processes. The most important capture is "jsMemoryAllocated", and is only available as part of a callback from onUpdatedWithMemory. An eventListener gets the update ping and returns a dictionary of process Objects that can then be manipulated. 

An if statement detects that a process is a tab through the process.type == "renderer" condition. If true, I call my constructor for the tab Object and pass it in the relevant parameters. A global array is declared to house these objects. The constructor pushes the derived Object to the global array on every call. 

Once I have a complete 1D array of Objects, I can then sort the Objects based on their respective allocated memory attribute (Tabs[i].allocd_mem). Once sorted, I can generate the HTML for popup.html. Buttons will be added under the li's for removing the tab. 

Note:
- in order to debug this, right click the broswer-action icon and select "inspect popup". Extensions use a 
different console which means that "console.log(arg);" will not work. Use "console.debug(arg);" for simple debugging, and "console.dir(arg);" if you want print a manipulatable representation of an object. 

APIs used:
- https://developer.chrome.com/extensions/processes
- https://developer.chrome.com/extensions/tabs
- https://developer.chrome.com/extensions/bookmarks
- https://developer.chrome.com/extensions/system_memory
- https://developer.chrome.com/devtools/docs/console-api

Other resources:
- http://jsfiddle.net/UTyDa/  [used to get "for (var key in process)" syntax]

- chrome://version/ 


Currently working on:

- Dynamically manipulating the DOM to display highest memory tabs. 
- CSS general
- kill tab button
- bookmark then kill button
