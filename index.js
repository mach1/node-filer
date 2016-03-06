import chokidar from 'chokidar'
import { authenticate, saveFile, getFiles, readFile } from './app/dropboxApi.js'
import Promise from 'bluebird'
import fs from 'fs'
import path from 'path'

const ignoredFiles = ['.DS_Store']
const DATA_DIR = '/data'
const LOCAL_DATA_DIR = '.' + DATA_DIR
const log = console.log.bind(console)

function fileAdded(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(error, data) {
      // No encoding passed, readFile produces a Buffer instance
      if (error) {
        reject(error)
        return handleNodeError(error)
      }

      saveFile(path, data).then(resolve, reject)
    })
  })
}

function shouldSaveFile(existingFiles, newFile) {
  return existingFiles.indexOf(newFile) === -1 &&
    ignoredFiles.indexOf(newFile) === -1
}

function saveFileIfNeeded(dropboxFiles, localFile) {
  return new Promise((resolve, reject) => {
    if (shouldSaveFile(dropboxFiles, localFile)) {
      const filePath = path.join(LOCAL_DATA_DIR, localFile)
      fileAdded(filePath).then(resolve, reject)
    } else {
      resolve()
    }
  })
}

function downloadFileIfNeeded(localFiles, dropboxFile) {
  return new Promise((resolve, reject) => {
    if (localFiles.indexOf(dropboxFile) === -1) {
      readFile(path.join(DATA_DIR,  dropboxFile)).then((data) => {
        fs.writeFile(path.join(LOCAL_DATA_DIR, dropboxFile), data, (err) => {
          if (err) {
            throw new Error('Failed to save: ' + dropboxFile)
            reject(err)
          }
        })
      }, reject)
    } else {
      reject()
    }
  })
}

function syncFiles() {
  return new Promise((resolve, reject) => {
    getFiles(DATA_DIR).then((dropboxFiles) => {
      fs.readdir(LOCAL_DATA_DIR, (err, localFiles) => {
        if (err) {
          reject(err)
          throw new Error('Failed to load local data dir', err)
        }

        const localFilePromises = localFiles.map((localFile) => {
          return saveFileIfNeeded(dropboxFiles, localFile)
        })

        const dropboxFilePromises = dropboxFiles.map((dropboxFile) => {
          return downloadFileIfNeeded(localFiles, dropboxFile)
        })

        const promises = localFilePromises.concat(dropboxFilePromises)

        Promise.all(promises).then(resolve)
      })
    }, reject)
  })
}

const watcher = chokidar.watch('data')

authenticate().then(() => {
  syncFiles().then(() => {
    console.log('all saved')
    watcher.on('add', path => fileAdded(path))
  })
})
