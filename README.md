# WebRTC Video Chat
## Info
This is a minimalist text and video chat implemented with vanilla JS, WebRTC, Peer.js and Socket.IO.

I decided for a lightweight approach in order to test the WebRTC technology with the smallest overhead.

## Prerequisites
You will need the following:
- Node.js installed locally
- Open port for the chat server, default port 5000
- Peer.js server, either from Peer.js themselves or your own. Free Peer.js Cloud Server: https://peerjs.com/peerserver
- ICE server, either a public one, or your own. List of free public servers: https://gist.github.com/yetithefoot/7592580

## Usage
- Pull the code
- Run `npm i` in the /server folder
- Run `node app.js` in the /server folder to start the Socket.IO server (port: 5000)
- Create a new file in /js/ callled 'settings.js'
- Edit this file like so:
```js
export default {
  chatServerURL: 'localhost:5000',
  ICEConfig: {
    host: '', // Add your own PeerJS server, or remove this to use Peer.js' own server
    port: 443,
    secure: true,
    config: {
      iceServers: [{
        url: '', // Add your own ICE server
        username: '',
        credential: ''
      }]
    }
  }
}

```
- Serve the index.html file using your favourite web server
- Open two browser windows and navigate to index.html
- Click on 'Join chat' in both windows. Once two users have connected, click 'Call with video' to start the video chat
