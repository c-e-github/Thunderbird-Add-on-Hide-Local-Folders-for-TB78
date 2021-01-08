
// function to hide the local folder in the given main window (if it is a normal main window)
function hideLocalFolder(window) {
	if (window.type != "normal")
		return;
	
	// hide local folders for the given window
	messenger.myapi.hidelocalfolder(window.id);
}

// register a event listener for newly opened windows, to
// automatically call hideLocalFolders() for them
messenger.windows.onCreated.addListener(hideLocalFolder);


// run thru all already opened main windows (type = normal) and hide local folders
// this will take care of all windows already open while the add-on is being installed or
// activated during the runtime of Thunderbird.
async function init() {
	let windows = await messenger.windows.getAll({windowTypes: ["normal"]});
	for (let window of windows) {
		hideLocalFolder(window);
	}
}

// run init()
init();