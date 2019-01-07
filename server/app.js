var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

io.on('connection', (socket) => {
/*  const guid = socket.handshake.query.guid
  const peerId = socket.handshake.query.peerId

  console.log(`client connected to guid ${guid} with PeerJS ID: ${peerId}`)

  if (guid !== null) {
    socket.join(guid)
    io.to(guid).emit('newClientId', peerId)
  } */

  socket.on('create or join', (data) => {
    const room = data.guid

    console.log('Received request to create or join room ' + room)

    var clientsInRoom = io.sockets.adapter.rooms[room]
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0

    console.log('Room ' + room + ' now has ' + numClients + ' client(s)')

    if (numClients === 0) {
      socket.join(room)
      console.log('Client ID ' + socket.id + ' created room ' + room)
      socket.emit('created', room, socket.id)
    } else if (numClients === 1) {
      console.log('Client ID ' + socket.id + ' joined room ' + room)
      io.sockets.in(room).emit('join', room)
      socket.join(room)
      socket.emit('joined', room, socket.id)
      io.sockets.in(room).emit('ready', room)
      // console.log(clientsInRoom)
    } else { // max two clients
      socket.emit('full', room)
    }
  })

  socket.on('startChat', (data) => {
    io.sockets.in(data.room).emit('sharePeerId', data.peerId)
  })
})

server.listen(5000)
