const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const maxClients = 2

let rooms = {}

io.on('connection', (socket) => {
  socket.on('create or join', (options) => {
    try {
      validateNickname(options.nickname)
      socket.nickname = options.nickname
    } catch (err) {
      return socket.emit('nicknameError', `Error: ${err}`)
    }

    const room = options.guid
    const clientsInRoom = io.sockets.adapter.rooms[room]
    const totalClients = clientsInRoom ? (Object.keys(clientsInRoom.sockets).length + 1) : 1

    if (totalClients > maxClients) return socket.emit('roomIsFull')

    socket.join(room)
    socket.emit('joinedRoom', room, socket.id, totalClients)
    socket.room = room

    if (totalClients === 1) {
      console.log(`User [${socket.nickname}] with socket ID [${socket.id}] created new room [${room}]`)
      rooms[room] = {}
    } else if (totalClients === 2) {
      console.log(`User [${socket.nickname}] with socket ID [${socket.id}] joined room [${room}]`)
      const nicknameList = Object.keys(io.sockets.adapter.rooms[room].sockets).map((socketId) => {
        return io.sockets.connected[socketId].nickname
      })
      io.sockets.in(room).emit('clientJoined', socket.nickname, nicknameList)
      io.sockets.in(room).emit('ready', room)
    }
    rooms[room][socket.nickname] = socket.nickname
    console.log(`Room [${room}] now has ${totalClients} ${totalClients === 1 ? 'client' : 'clients'}`)
  })

  socket.on('chatMessage', (message) => {
    if (message.length <= 0) {
      socket.emit('errorSendingMessage', 'Error: Cannot send empty message!')
    } else {
      console.log(`Got message from ${socket.id}: ${message}`)
      const joinedRooms = Object.keys(socket.rooms).filter(item => item!=socket.id);
      // console.log(joinedRooms)
      socket.to(joinedRooms).emit('chatMessage', message);
      socket.emit('chatMessageSent', message)
    }
  })

  socket.on('startChat', (data) => {
    io.sockets.in(data.room).emit('sharePeerId', data.peerId)
  })

  socket.on('disconnect', () => {
    console.log(`room: ${socket.room}`)

    /*let nicknameList = Object.keys(io.sockets.adapter.rooms[socket.room].sockets).map((socketId) => {
      return io.sockets.connected[socketId].nickname
    })*/

    delete rooms[socket.room][socket.nickname]
    let nicknameList = Object.keys(rooms[socket.room])
  
    io.sockets.in(socket.room).emit('clientLeft', socket.nickname, nicknameList)

    console.log(`User [${socket.nickname}] left room [${socket.room}]`)
    console.log(`Remaining users: ${nicknameList}`)
  })
})

function validateNickname (name) {
  // console.log(name)
  if (!name || name.length < 1) throw 'Nickname must be at least 1 character long'
  if (/^([a-z])\w+$/gi.test(name) === false) throw 'Nickname may only contain alphanumeric characters'
}

server.listen(5000)
