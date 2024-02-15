const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_ORIGIN}`
  }
});

const router = require('./router');
const { getUser, removeUser, addUser, getUsersInRoom } = require('./users');

const allowedUrls = ["http://localhost:5173/", `${process.env.CLIENT_ORIGIN}/`, `${process.env.CLIENT_ORIGIN}`];
const corsOptions = {
  origin: (origin, callback) => {
    if (origin===undefined || allowedUrls.indexOf(origin) !== -1) {
    callback(null, true)
    } else {
    callback(new Error())
    }
  },
  credentials: true
}

app.use(cors(corsOptions));
app.use(router);

io.on('connection', (socket) => {

  socket.on('join', ({ name, roomId }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, roomId });
    
    if (error) return callback(error);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.roomId}`});
    socket.broadcast.to(user.roomId).emit('message', { user: 'admin', text: `${user.name} has joined`});

    socket.join(user.roomId);

    io.to(user.roomId).emit('roomData', { roomId: user.roomId, users: getUsersInRoom(user.roomId) });

    callback();
  });

  socket.on('sendMessage', ({message, file}, callback) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit('message', { user: user.name, text: message, file});
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.roomId).emit('message', { user: 'admin', text: `${user.name} has left`});
      io.to(user.roomId).emit('roomData', { roomId: user.roomId, users: getUsersInRoom(user.roomId) });
    }
  });
});

server.listen(PORT, () => {
  console.log('server running at', PORT);
});