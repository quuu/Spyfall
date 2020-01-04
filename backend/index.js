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

const port = 3001


MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  assert.equal(null, err);
  const db = client.db('spyfall');

  db.collection('games').dropIndex({ "created": 1 })

  db.collection('games').createIndex({ "created": 1 }, { expireAfterSeconds: 50000 })

  console.log("Connected successfully to server");


  // once connected, it means they are creating a new room or joining a room
  io.on('connection', function (socket) {

    // printing out the ip address to save for later
    console.log(socket.handshake.address)
    console.log("a user connected")

   
    // creating a new room for people to join
    socket.on('create', function (firstPlayer, fn) {
      
      console.log("the firstPlayer is ")
      console.log(firstPlayer)

      const uuid = uuidv4();

      // create the room code
      // as a substring of the entire uuid
      const roomCode = uuid.substr(0, 5)

      console.log('Created room: ' + roomCode)

      let players = []

      players.push(firstPlayer)

      // subscrive player to the room for updates
      socket.join(roomCode)
      

      // return the room code and the current players to the emitter
      fn({'room': roomCode, 'players':players})
    })


    // join a room
    socket.on('join', function (data, fn) {
      console.log(data)
      console.log(io.sockets.adapter.rooms)

      // if the room exists to join
      if (io.sockets.adapter.rooms[data[0]] != null) {
        socket.join(data[0])

        io.to(data[0]).emit('newplayer', 'testing')
        
        fn({'success': 'joined room', 'room': data[0]})

      }
      else {
        console.log('not valid room')
        fn({'success':'invalid room'})
      }
      console.log(io.sockets.adapter.rooms)

    })

    socket.on('rejoin', function (data, fn) {
      socket.join(data)
      console.log("rejoined room " + data)
      fn({'success':'rejoined room'})
    })
  

    // when a player quits, leave the room 
    socket.on('leave', function (data) {
      socket.leave(data)
      console.log("a player has left " + data)
    })

    // start the game
    socket.on('start', function (data) {
      console.log("starting game")
      // console.log(data)
      io.to(data).emit('starting')
    })

    // quitting the game
    socket.on('disconnect', function() {
      console.log('a user disconnected')

    })
    socket.on('other event', function (data) {
      console.log(data)
    })
  })
 
 
});



http.listen(port, function(){
  console.log('listening on *:'+ port);
});