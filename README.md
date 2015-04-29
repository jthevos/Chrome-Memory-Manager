# Chrome-Memory-Manager
Clone this repo and npm install for package.json. This extension is only functional on the developer channel of chrome. chrome://version/ shows you your current channel. Visit http://www.chromium.org/getting-involved/dev-channel to change your version. To load the extension in Chrome,

	1. Visit chrome://extensions in your browser.

	2. Ensure that the Developer mode checkbox in the top right-hand corner is checked.

	3. Click Load unpacked extension… to pop up a file-selection dialog.

	4. Navigate to the directory in which your extension files live, and select it.

This code is designed to be an in client memory mangement system. The javascript will take a snapshot of the users current tabs across all windows, capturing all live processes currently running on Chrome's internal task manager. From these processes, I then build an array of JSON Objects with defined properties.

This code is attempting to create several instences of a JSON Object, Tab, with the captured information from processes. The most important capture is private memory allocated, and is only available as part of a callback from onUpdatedWithMemory. An eventListener gets the update ping and returns a dictionary of process Objects that can then be manipulated. 

An if statement detects that a process is a tab that process has an array of length 1 associated with the process object. If true, I call my constructor for the tab Object and pass it in the relevant parameters. A global array is declared to house these objects. The constructor pushes the derived Object to the global array on every call. 

Once I have a complete one-dimensional array of Objects, I can then sort the Objects based on their respective allocated memory attribute (Tabs[i].allocd_mem). I pass the attribute as a string, and use a ternery operator to determine how to sort. Once sorted, I can generate the HTML table for popup.html.  

Note:
- in order to debug this, right click the broswer-action icon and select "inspect popup". Extensions use a 
different console which means that "console.log(arg);" will not work. Use "console.debug(arg);" for simple debugging, and "console.dir(arg);" if you want print a manipulatable representation of an object. 

APIs used:
- https://developer.chrome.com/extensions/processes
- https://developer.chrome.com/extensions/tabs
- https://developer.chrome.com/extensions/bookmarks
- https://developer.chrome.com/extensions/system_memory
- https://developer.chrome.com/devtools/docs/console-api
 
Currently working on:

- dynamically creating the DOM with appropriate bootstrap classes
- close button eventListener to remove table row of terminated tab

