const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
let win1, win2;

function createWindow (index, width, height) {
  let window = new BrowserWindow({width: width, height: height});

  window.loadURL(url.format({
    pathname: path.join(__dirname, index),
    protocol: 'file:',
    slashes: true
  }));
  return window;
}

app.on('ready', function() {
  win1 = createWindow('index1.html', 600, 600);
  win1.on('closed', function () {win1 = null});

  ipcMain.on('createWin', (event) => {
    if (!win2) win2 = createWindow('index2.html', 400, 400);
    win2.on('closed', function () {win2 = null});
  });

  ipcMain.on('win1msg', (event, arg) => {
    win2.webContents.send('hello', arg)
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win1 === null) {
    createWindow(win1, 'index1.html')
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
