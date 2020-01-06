const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const app = express()
const cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const url = 'mongodb://localhost:27017';


app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// to keep track of games and the players in that game
let games = {}

const port = 3001


// TODO use mongo to keep track of game and player names
// instead of storing it in memory
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(null, err);
  const db = client.db('spyfall');

  db.collection('games').dropIndex({ "created": 1 })

  db.collection('games').createIndex({ "created": 1 }, { expireAfterSeconds: 50000 })

  console.log("Connected successfully to server");


  // once connected, it means they are creating a new room or joining a room
  io.on('connection', (socket) => {

    // printing out the ip address to save for later
    console.log(socket.handshake.address)
    console.log("a user connected")

   
    // creating a new room for people to join
    socket.on('create', (firstPlayer, fn) => {
      

      const uuid = uuidv4();

      // create the room code
      // as a substring of the entire uuid
      const roomCode = uuid.substr(0, 5)

      console.log('User ' + firstPlayer + ' created room ' + roomCode)

      games[roomCode] = []
      games[roomCode].push(firstPlayer)

      let players = []

      players.push(firstPlayer)

      // subscrive player to the room for updates
      // socket.join(roomCode)
      

      // return the room code and the current players to the emitter
      fn({'room': roomCode, 'players':players})
    })


    // join a room
    // makes sure the room exists
    // emits a signal to all connected players with message 
    //    saying that a new player has joined with username
    // emits to sender the other players in the game
    socket.on('join', (data, fn) => {
      console.log(data)
      // console.log(io.sockets.adapter.rooms)

      // if the room exists to join
      if (io.sockets.adapter.rooms[data[0]] != null) {

        console.log('broadcasting new player to people ---')
        io.to(data[0]).emit('newplayer', data[1])

        games[data[0]].push(data[1])
        console.log(games)

        // socket.join(data[0])
        fn({'success': 'joined room', 'room': data[0], 'players':games[data[0]]})

      }
      else {
        console.log('not valid room')
        fn({'success':'invalid room'})
      }

    })

    socket.on('test', (data, fn) => {
      socket.emit('newplayer', 'T')
    })

    socket.on('rejoin', (data, fn) => {
      socket.join(data)
      console.log(io.sockets.adapter.rooms)
      console.log("rejoined room " + data)
      fn({'success':'joined room'})
    })
  

    // when a player quits, leave the room 
    socket.on('leave', (data) => {
      console.log(io.sockets.adapter.rooms)
      socket.leave(data)
      console.log(io.sockets.adapter.rooms)
      console.log("a player has left " + data)
      io.to(data).emit('playerleave')
    })

    // start the game
    socket.on('start', (data) => {
      console.log("starting game " + data)
      io.to(data).emit('starting')

      // TODO
      // loop trhough the clients, and send a "spy" message
      // to one, and send "start" to the others
    })

    socket.on('end', (data) => {
      console.log("ending game " + data)
      io.to(data).emit('ending')
    })

    // quitting the game
    socket.on('disconnect', () => {
      console.log('a user disconnected')

    })
    socket.on('other event', (data) => {
      console.log(data)
    })
  })
 
 
});



http.listen(port, () => {
  console.log('listening on *:'+ port);
});