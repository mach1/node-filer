import net from 'net';
import fs from 'fs';

export default class PeerServer {
  constructor(port) {
    this.handleConnection = this.handleConnection.bind(this);
    this.handleData = this.handleData.bind(this);

    this.server = net.createServer(this.handleConnection);
    this.server.listen(port, '127.0.0.1');
    console.log('Listening on: ' + port);
  }

  handleConnection(socket) {
    this.socket = socket;
    console.log("Peer connected from:", socket.remoteAddress);


    socket.on('data', this.handleData);

    socket.on('close', function() {
      console.log("Peer left");
    });
  }

  handleData(data) {
    if (data.toString() === 'LIST') {
      fs.readdir('data/out', function(err, files) {
        this.socket.write(files.toString());
      }.bind(this));
    } else if (data.toString().indexOf('GET_FILE') === 0) {
      this.socket.write('FILE');
      var fileStream = fs.createReadStream('data/out/test.txt');
      fileStream.pipe(this.socket);
    }
  }
}
