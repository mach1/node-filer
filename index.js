import chokidar from 'chokidar'

const watcher = chokidar.watch('data/in')
const log = console.log.bind(console)

watcher.on('add', path => log(path))
