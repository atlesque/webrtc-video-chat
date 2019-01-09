import settings from './settings'

const chatInput = document.getElementById('chat-input')
const chatOutput = document.getElementById('chat-output')
const sendButton = document.getElementById('send-button')
const joinChatButton = document.getElementById('join-chat')
const nicknameInput = document.getElementById('nickname-input')
const partnerStatus = document.getElementById('partner-status')

let peerConnection
let socket
let ownNickname

function connect (options) {
  joinChatButton.disabled = true
  log('Connecting to chat server...')
  socket = io(settings.chatServerURL)
  initVideoConnection()
  socket.emit('create or join', { guid: 'test-guid', peerId: peerConnection.id, nickname: options.nickname })
  ownNickname = options.nickname
  setupSocketBindings(socket)
}

function log (text, {type = 'info'} = {}) {
  let listItem = document.createElement('li')
  listItem.setAttribute('class', `chat__message chat__${type}-message`)
  listItem.insertAdjacentText('beforeend', text)
  chatOutput.appendChild(listItem)
  chatOutput.scrollTop = chatOutput.scrollHeight // Scroll to bottom
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
    enableInput(true)
    nicknameInput.disabled = true
  })

  socket.on('roomIsFull', (room) => {
    log('Cannot connect: the room is full.')
  })

  socket.on('clientJoined', (clientName, clientList) => {
    // log(`Another client joined the room. Total clients connected: ${totalClients}`)
    // log(`Nicknames: ${nicknameList}`)
    if(clientName !== ownNickname) log(`${clientName} connected.`)
    const partnerList = clientList.filter((name) => name != ownNickname)
    partnerStatus.innerHTML = partnerList.length > 0 ? partnerList : 'offline'
  })

  socket.on('chatMessage', (message) => {
    log(message, {type: 'remote'})
  })

  socket.on('chatMessageSent', (message) => {
    log(message, {type: 'local'})
    resetInput()
  })

  socket.on('errorSendingMessage', (message) => {
    log(message, {type: 'error'})
    enableInput(true)
  })

  socket.on('nicknameError', (message) => {
    log(message, {type: 'error'})
    joinChatButton.disabled = false
    nicknameInput.focus()
  })

  socket.on('clientLeft', (clientName, clientList) => {
    log(`${clientName} disconnected.`)
    const partnerList = clientList.filter((name) => name != ownNickname)
    partnerStatus.innerHTML = partnerList.length > 0 ? partnerList : 'offline'
  })

  /*socket.on('ready', (room) => {
    log('two clients connected, ready for chat!')
    socket.emit('startChat', {room: room, peerId: peerConnection.id})
  })*/
}

function sendChatMessage (message) {
  enableInput(false)
  socket.emit('chatMessage', message)
}

function resetInput () {
  chatInput.value = ''
  enableInput(true)
}

function enableInput (enableInput) {
  chatInput.disabled = !enableInput
  sendButton.disabled = !enableInput
  if (enableInput === true) chatInput.focus()
}

export { connect, sendChatMessage }
