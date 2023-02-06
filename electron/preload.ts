// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from 'electron'

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once('loaded', () => {
	contextBridge.exposeInMainWorld('versions', process.versions)
})

// in react app, should be able to call ipcrenderer to send things
// to the main process use send and on
// ie: ipcRenderer.send('image:resize', {...data})

// we can catch ipc events from the app by using
// ipcRenderer.on('image:doneResize', () => { bla } )
// send success message from the main by doing
// mainWindow.webContents.send('image:doneResize', data)
contextBridge.exposeInMainWorld('ipcRenderer', {
	send: (channel: string, data: any) => {
		ipcRenderer.send(channel, data)
	},
	on: (channel: string, fn: any) => {
		ipcRenderer.on(channel, (event, ...args) => fn(...args))
	},
})
