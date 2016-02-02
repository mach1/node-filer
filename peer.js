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
    console.log('Recieved data');

    console.log('Data: ', data.toString());
    var fileStream = fs.createWriteStream('data/in/test.txt');
    fileStream.write(data);
  }

  handlePeerConnection() {
    this.socket.write('LIST');
  }
}
