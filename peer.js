import net from 'net';
import fs from 'fs';

export default class Peer {
  constructor(ip, port) {
    this.handleData = this.handleData.bind(this);
    this.handlePeerConnection = this.handlePeerConnection.bind(this);

    this.socket = net.createConnection(port, ip, this.handlePeerConnection);

    this.socket.on('data', this.handleData);
  }

  handleData(data) {
    const dataStr = data.toString();
    console.log('Recieved data:' + dataStr);

    if (dataStr.indexOf('LIST:') === 0) {
      let files = dataStr.substring(5).split(',');
      let socket = this.socket;

      files.forEach(function(file) {
        socket.write('GET_FILE:' + file);
      });
    } else if (dataStr.indexOf('FILE') === 0) {
      var fileStream = fs.createWriteStream('data/in/test.txt');
      fileStream.write(dataStr);
    }
  }

  handlePeerConnection() {
    this.socket.write('LIST');
  }
}
