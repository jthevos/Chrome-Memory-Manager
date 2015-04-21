# Chrome-Memory-Manager
This extension is only functional on the developer channel of chrome. chrome://version/ shows you your current channel. Visit http://www.chromium.org/getting-involved/dev-channel to change your version. 

APIs used:
- https://developer.chrome.com/extensions/processes
- https://developer.chrome.com/extensions/tabs
- https://developer.chrome.com/extensions/bookmarks
- https://developer.chrome.com/extensions/system_memory

This code is designed to be an in-client memory mangement system. The javascript will take a snapshot of the users current tabs across all windows, capturing the processId as provided by the browser's OS. Tab_id, tab_title, and javascript allocated memory will be derived from the processId. 

This code is attempting to create several instences of a JSON Object, Tab, with the captured information above -stored in 4 global arrays. I am pulling this information separately and asynchronously through nested callback functions. Global boolean values act as "switches" which allow the async processes to fire the correct number of times. After all arrays are populated, I then create the Objects.

Once I have a complete 1D array of Objects, I can then sort the Objects based on their respective allocated memory attribute (Tabs[i].allocd_mem). Once sorted, I can generate the HTML for popup.html. Buttons will be added under the li's for removing the tab. 

Currently working on:

- Successfully capturing jsMemoryAllocated.
- Dynamically manipulating the DOM to display highest memory tabs. 
- CSS general
- kill tab button
- bookmark then kill button
