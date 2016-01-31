import PeerServer from './server.js';
import Peer from './peer.js';

const PORT = +process.argv[2];
const PEER_ADDRESS = process.argv[3];
const PEER_PORT = +process.argv[4];

const peerServer = new PeerServer(PORT);

if (PEER_ADDRESS && PEER_PORT) {
  let peer = new Peer(PEER_ADDRESS, PEER_PORT);
}
