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

function initVideoConnection () {
  peerConnection = new Peer(settings.ICEConfig)
}

function setupSocketBindings (socket) {
  socket.on('joinedRoomAsFirst', function (room, clientId) {
    log('Connected! You are the first here.')
  })

  socket.on('roomIsFull', function (room) {
    log('Cannot connect: the room is full.')
  })

  socket.on('joined', function (room, clientId) {
    log('Connected! Your partner is already in the chatroom.')
  })

  socket.on('log', function (array) {
    console.log.apply(console, array)
    log(array)
  })

  /*socket.on('ready', function (room) {
    log('two clients connected, ready for chat!')
    socket.emit('startChat', {room: room, peerId: peerConnection.id})
  })*/
}

function log(text) {
  document.getElementById('chat').insertAdjacentHTML('beforeend', `<li class='chat__text--log'>${text}</li>`)
}

export { connect, initVideoConnection }
