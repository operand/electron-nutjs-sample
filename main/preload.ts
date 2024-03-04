const { contextBridge, ipcRenderer } = require('electron');

const allowedChannels = ['systemFunctionCall', 'systemFunctionCallResponse'];

contextBridge.exposeInMainWorld('electron', {
  ipcRendererSend: (channel: string, message: object) => {
    if (allowedChannels.includes(channel)) {
      console.log('Preload relaying message', { channel, message });
      ipcRenderer.send(channel, message);
    } else {
      console.error(`Unknown IPC channel: ${channel}`);
    }
  },
  ipcRendererOn: (channel: string, callback: Function) => {
    if (allowedChannels.includes(channel)) {
      console.log(`Preload listening on ${channel}`);
      ipcRenderer.on(channel, (_, message) => callback(message));
    } else {
      console.error(`Unknown IPC channel: ${channel}`);
    }
  }
});