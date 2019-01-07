import settings from './settings'

let peerConnection
let socket

function connect () {
  document.getElementById('join-chat').disabled = true
  log('Connecting to chat server...')
  socket = io(settings.chatServerURL)
}

function initVideoConnection () {
  peerConnection = new Peer(settings.ICEConfig)
}

function log(text) {
  document.getElementById('chat').insertAdjacentHTML('beforeend', `<li class='chat__text--log'>${text}</li>`)
}

export { connect, initVideoConnection }
