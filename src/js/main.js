const electron = require('electron');
const { app, BrowserWindow, Menu } = electron


try {
  require('electron-reloader')(module)
} catch (_) {}

app.on('ready', createWindow);
var win;
exports = win;
function createWindow () {
  win = new BrowserWindow({
    resizable: false,
    width: 1280,
    height: 746,
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