import net from 'net';

export default class Peer {
  constructor(ip, port) {
    this.socket = net.createConnection(port, ip, this.handlePeerConnection);
    this.handleData = this.handleData.bind(this);
    this.socket.on('data', this.handleData);
  }

  handleData(data) {
    console.log('Recieved data');
    console.log('Data: ', data.toString());

    this.socket.destroy();
    console.log('Closed connection');
  }

  handlePeerConnection() {
    console.log("Connected.");
  }
}
