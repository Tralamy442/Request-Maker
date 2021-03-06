const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron


try {
  require('electron-reloader')(module)
} catch (_) {}

app.on('ready', createWindow);
var win;
function createWindow () {
  win = new BrowserWindow({
    resizable: true,
    width: 650,
    height:450,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('src/html/index.html');

  Menu.setApplicationMenu(null);
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

/* Listener */
ipcMain.on('reload', () => {
  win.reload();
});