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
  socket.on('joinedEmptyRoom', function (room, clientId) {
    log('Connected! You are the first here.')
  })

  socket.on('roomIsFull', function (room) {
    log('Cannot connect: the room is full.')
  })

  socket.on('joinedOccupiedRoom', function (room, clientId, numClients) {
    var otherClientsCount = numClients - 1
    log(`Connected! There ${otherClientsCount === 1 ? 'is' : 'are'} ${otherClientsCount} other client${otherClientsCount === 1 ? '' : 's'} in the room.`)
  })

  socket.on('log', function (array) {
    console.log.apply(console, array)
    log(array)
  })

  socket.on('clientJoined', function (room, totalClients) {
    log(`Another client joined the room. Total clients connected: ${totalClients}`)
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
