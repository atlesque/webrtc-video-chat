import settings from './settings'

let peerConnection
let socket

function connect () {
  document.getElementById('join-chat').disabled = true
  log('Connecting to chat server...')
  socket = io(settings.chatServerURL)
  initVideoConnection()
  socket.emit('create or join', { guid: 'test-guid', peerId: peerConnection.id })
  setupSocketBindings(socket)
}

function log(text) {
  document.getElementById('chat-output').insertAdjacentHTML('beforeend', `<li class='chat__text--log'>${text}</li>`)
}

function initVideoConnection () {
  peerConnection = new Peer(settings.ICEConfig)
}

function setupSocketBindings (socket) {
  socket.on('joinedRoom', (room, clientId, numClients) => {
    var otherClientsCount = numClients - 1
    if (otherClientsCount === 0) {
      log('Connected! You are the first here.')
    } else {
      log(`Connected! There ${otherClientsCount === 1 ? 'is' : 'are'} ${otherClientsCount} other client${otherClientsCount === 1 ? '' : 's'} in the room.`)
    }
    document.getElementById('send-button').disabled = false
    document.getElementById('chat-input').disabled = false
  })

  socket.on('roomIsFull', (room) => {
    log('Cannot connect: the room is full.')
  })

  socket.on('clientJoined', (room, totalClients) => {
    log(`Another client joined the room. Total clients connected: ${totalClients}`)
  })

  socket.on('chatMessage', (message) => {
    log(`Got message: ${message}`)
  })

  socket.on('chatMessageSent', () => {
    document.getElementById('chat-input').disabled = false
    document.getElementById('chat-input').value = ''
    document.getElementById('send-button').disabled = false
  })

  /*socket.on('ready', (room) => {
    log('two clients connected, ready for chat!')
    socket.emit('startChat', {room: room, peerId: peerConnection.id})
  })*/
}

function sendChatMessage (message) {
  socket.emit('chatMessage', message)
}

export { connect, sendChatMessage }
