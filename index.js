import chokidar from 'chokidar'
import { authenticate, saveFile } from './app/dropboxApi.js'
import Promise from 'bluebird'
import fs from 'fs'

function fileAdded(path) {
  fs.readFile(path, function(error, data) {
    // No encoding passed, readFile produces a Buffer instance
    if (error) {
      return handleNodeError(error);
    }

    saveFile(path, data);
  });
}


const watcher = chokidar.watch('data/in')
const log = console.log.bind(console)


authenticate().then(() => {
  watcher.on('add', path => fileAdded(path))
})

