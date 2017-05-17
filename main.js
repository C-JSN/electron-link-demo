const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win1
let win2

const {ipcMain} = require('electron')

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg)  // prints "ping"
//   event.returnValue = 'pong'
// })

function createWindow (index) {
  // Create the browser window.
  let window = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  window.loadURL(url.format({
    pathname: path.join(__dirname, index),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  window.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null
  })

  return window;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  win1 = createWindow('index1.html');
  win2 = createWindow('index2.html');

  // webContents is a Node class EventEmitter.
  ipcMain.on('win1msg', (event, arg) => {
    win2.webContents.send('hello', arg)
  })

  ipcMain.on('win2msg', (event, arg) => {
    win1.webContents.send('hello', arg)
  })
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
