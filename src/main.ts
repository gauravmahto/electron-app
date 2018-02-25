/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import path from 'path';
import url from 'url';

import {
  app, ipcMain,
  BrowserWindow,
  Menu, MenuItemConstructorOptions
} from 'electron';

// Set the node env.
process.env.NODE_ENV = 'production';

let mainWindow: BrowserWindow | null;
let addWindow: BrowserWindow | null;

// Listen for the app to be ready.
app.on('ready', () => {

  // Create a new window.
  mainWindow = new BrowserWindow();

  // Load HTML file.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'main.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Quit the whole app when main window closes.
  mainWindow.on('close', () => {

    app.quit();
    mainWindow = null;

  });

  // Build menu from template.
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu.
  Menu.setApplicationMenu(mainMenu);

});

// Create new add window.
function createAddWindow() {

  // Create a new window.
  addWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'Add items'
  });

  // Remove menu.
  addWindow.setMenu(null);

  // Load HTML file.
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'add-items', 'add-window.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Allow GC.
  addWindow.on('close', () => addWindow = null);

}

// IPC message handler for 'item:add'.
ipcMain.on('item:add', ({ }, item: any) => {

  if (null !== mainWindow &&
    null !== addWindow &&
    !!item) {

    mainWindow.webContents.send('item:add', item);
    addWindow.close();

  }

});

// Create menu template.
const mainMenuTemplate: MenuItemConstructorOptions[] = [{
  label: 'File',
  submenu: [{
    label: 'Add Items',
    click() {
      createAddWindow();
    }
  }, {
    label: 'Clear Items',
    click() {
      if (null !== mainWindow) {
        mainWindow.webContents.send('item:clear');
      }
    }
  }, {
    label: 'Quit',
    accelerator: process.platform === 'darwin' ?
      'Command+Q' :
      'Ctrl+Q',
    click() {
      app.quit();
    }
  }]
}];

// Add an empty object for MAC.
if (process.platform === 'darwin') {

  mainMenuTemplate.unshift({});

}

// Add debug window capability if not in production mode.
if (process.env.NODE_ENV !== 'production') {

  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [{
      label: 'Toggle DevTools',
      accelerator: process.platform === 'darwin' ?
        'Command+I' :
        'Ctrl+I',
      click({ }, focusedWindow) {
        focusedWindow.webContents.toggleDevTools();
      }
    }, {
      role: 'reload'
    }]
  });

}
