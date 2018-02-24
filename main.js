'use strict';

const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

let mainWindow;

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

});
