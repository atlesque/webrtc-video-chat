var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.on('create or join', (data) => {
    const room = data.guid

    console.log('Received request to create or join room ' + room)

    var clientsInRoom = io.sockets.adapter.rooms[room]
    var totalClients = clientsInRoom ? (Object.keys(clientsInRoom.sockets).length + 1) : 1

    console.log('Room ' + room + ' now has ' + totalClients + ' client(s)')

    if (totalClients === 1) {
      socket.join(room)
      console.log('Client ID ' + socket.id + ' created room ' + room)
      socket.emit('joinedRoom', room, socket.id, totalClients)
    } else if (totalClients === 2) {
      console.log('Client ID ' + socket.id + ' joined room ' + room)
      io.sockets.in(room).emit('clientJoined', room, totalClients)
      socket.join(room)
      socket.emit('joinedRoom', room, socket.id, totalClients)
      io.sockets.in(room).emit('ready', room)
      // console.log(clientsInRoom)
    } else { // max two clients
      socket.emit('roomIsFull', room)
    }
  })

  socket.on('chatMessage', (message) => {
    console.log(`Got message from ${socket.id}: ${message}`)
    var joinedRooms = Object.keys(socket.rooms).filter(item => item!=socket.id);
    console.log(joinedRooms)
    socket.to(joinedRooms).emit('chatMessage', message);
    socket.emit('chatMessageSent', message)
  })

  socket.on('startChat', (data) => {
    io.sockets.in(data.room).emit('sharePeerId', data.peerId)
  })
})

server.listen(5000)
