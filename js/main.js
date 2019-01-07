let peerConnection

function connect () {
  document.getElementById('join-chat').disabled = true
  log('Connecting to chat server...')

}

function initVideoConnection () {
  peerConnection = new Peer(ICEConfig)
}

function log(text) {
  document.getElementById('chat').insertAdjacentHTML('beforeend', `<li class='chat__text--log'>${text}</li>`)
}
