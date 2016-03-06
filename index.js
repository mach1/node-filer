import chokidar from 'chokidar'
import { authenticate, saveFile, getFiles } from './app/dropboxApi.js'
import Promise from 'bluebird'
import fs from 'fs'
import path from 'path'

const ignoredFiles = ['.DS_Store']
const DATA_DIR = '/data'
const LOCAL_DATA_DIR = '.' + DATA_DIR

function fileAdded(path) {
  fs.readFile(path, function(error, data) {
    // No encoding passed, readFile produces a Buffer instance
    if (error) {
      return handleNodeError(error);
    }

    saveFile(path, data);
  });
}

function shouldSaveFile(existingFiles, newFile) {
  return existingFiles.indexOf(newFile) === -1 &&
    ignoredFiles.indexOf(newFile) === -1
}

function saveNewFiles() {
  getFiles(DATA_DIR).then((dropboxFiles) => {
    fs.readdir(LOCAL_DATA_DIR, (err, localFiles) => {
      if (err) {
        throw new Error('Failed to load local data dir', err)
      }

      localFiles.forEach(localFile => {
        if (shouldSaveFile(dropboxFiles, localFile)) {
          const filePath = path.join(LOCAL_DATA_DIR, localFile)
          fileAdded(filePath)
        }
      })
    })
  })  
}

const watcher = chokidar.watch('data')
const log = console.log.bind(console)


authenticate().then(() => {
  //watcher.on('add', path => fileAdded(path))
  saveNewFiles()
})

