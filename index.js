import chokidar from 'chokidar'
import { authenticate } from './app/dropboxApi.js'

const watcher = chokidar.watch('data/in')
const log = console.log.bind(console)

watcher.on('add', path => log(path))

authenticate()
