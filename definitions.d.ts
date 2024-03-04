interface Window {
  // Defines the global electron object available in the renderer process
  electron: {
    ipcRendererSend: (channel: string, message: object) => void;
    ipcRendererOn: (channel: string, callback: Function) => void;
  };
}
