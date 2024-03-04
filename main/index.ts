import { FileType, screen } from "@nut-tree/nut-js";
import crypto from 'crypto';
import { BrowserWindow, app, ipcMain } from 'electron';
import os from 'os';
import * as path from 'path';
import * as url from 'url';


let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.cjs'),
      webSecurity: false, // TODO: turn on in production
    },
  });
  const startUrl = (process.env.NODE_ENV === 'production')
    ? url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true,
    })
    : 'http://localhost:8080'; // the webpack-dev-server url

  mainWindow.maximize();
  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // send focus back to the page
  mainWindow.focus();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('systemFunctionCall', async (event, message) => {
  console.log('Main received', message)
  const { id, type, payload } = message;
  switch (payload.name) {

    case 'captureScreenshot':
      console.log('Capturing screenshot');
      try {
        const tempDir = os.tmpdir();
        const fileName = crypto.randomBytes(16).toString('hex');
        const fileType = FileType.PNG;
        await screen.capture(fileName, undefined, tempDir);
        console.log(`Screenshot saved to ${tempDir}/${fileName}${fileType}`);
        event.reply('systemFunctionCallResponse', {
          commandId: id,
          success: true,
          response: fileName
        });
      } catch (error) {
        console.log('Main relaying error to renderer', error)
        event.reply('systemFunctionCallResponse', {
          commandId: id,
          success: false,
          response: error
        });
      }
      break;

    default:
      throw new Error(`Unknown system function: ${payload.name}`);
  }
});
