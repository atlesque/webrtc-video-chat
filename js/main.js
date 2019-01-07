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

function log (text, {type = 'info'} = {}) {
  const output = `<li class='chat__message chat__${type}-message'>${text}</li>`
  const chatOutputElement = document.getElementById('chat-output')
  chatOutputElement.insertAdjacentHTML('beforeend', output)
  chatOutputElement.scrollTop = chatOutputElement.scrollHeight // Scroll to bottom
}

function initVideoConnection () {
  peerConnection = new Peer(settings.ICEConfig)
}

function setupSocketBindings (socket) {
  socket.on('joinedRoom', (room, clientId, numClients) => {
    const otherClientsCount = numClients - 1
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
    log(message, {type: 'remote'})
  })

  socket.on('chatMessageSent', (message) => {
    log(message, {type: 'local'})
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
