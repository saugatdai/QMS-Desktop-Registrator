const {app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 550,
        height: 300,
        icon: path.join(__dirname,'/favicon.png') 
    });
    mainWindow.removeMenu();
    mainWindow.setResizable(false);
    mainWindow.loadFile("render.html");
});