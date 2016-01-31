import net from 'net';

export default class PeerServer {
  constructor(port) {
    this.server = net.createServer(this.handleConnection);
    this.server.listen(port, '127.0.0.1');
    console.log('Listening on: ' + port);
  }

  handleConnection(socket) {
    console.log("Peer connected from:", socket.remoteAddress);
    socket.write('hello');

    socket.on('close', function() {
      console.log("Peer left");
    });
  }
}
