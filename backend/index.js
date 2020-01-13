const express = require('express')
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
const uuidv4 = require('uuid/v4');
const app = express()
const cors = require('cors')
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const fs = require('fs');

const url = 'mongodb://localhost:27017';


app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const locations = fs.readFileSync('locations.txt').toString().split("\n")


// to keep track of games and the players in that game
let games = {}

const port = 3001


// TODO use mongo to keep track of game and player names
// instead of storing it in memory
// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
//   assert.equal(null, err);
//   const db = client.db('spyfall');

//   db.collection('games').dropIndex({ "created": 1 })

//   db.collection('games').createIndex({ "created": 1 }, { expireAfterSeconds: 50000 })

//   console.log("Connected successfully to server");


//   // once connected, it means they are creating a new room or joining a room
  io.on('connection', (socket) => {

    // printing out the ip address to save for later
    console.log("a user connected " + socket.handshake.address)

   
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
      // console.log(io.sockets.adapter.rooms)

      // if the room exists to join
      if (io.sockets.adapter.rooms[data[0]] != null) {
        console.log("New player has joined " + data[0])

        io.to(data[0]).emit('newplayer', data[1])

        games[data[0]].push(data[1])

        // socket.join(data[0])
        fn({'success': 'joined room', 'room': data[0], 'players':games[data[0]]})

      }
      else {
        console.log('Not valid room')
        fn({'success':'invalid room'})
      }

    })

    socket.on('test', (data, fn) => {
      socket.emit('newplayer', 'T')
    })

    // on connecting to the server
    socket.on('rejoin', (data, fn) => {
      socket.join(data)
      console.log("rejoined room " + data)
      fn({'success':'joined room'})
    })
  

    // when a player quits, leave the room 
    socket.on('leave', (data) => {
      socket.leave(data[0])
      console.log("a player has left " + data[0])

      // let everyone in the room know
      io.to(data[0]).emit('playerleave', data[1])

      if (games[data[0]] == null) {
        return
      }

      // remove that player from the current game storage
      games[data[0]] = games[data[0]].filter((e) => { return e != data[1] })

    })

    // start the game
    socket.on('start', (data) => {
      if (io.sockets.adapter.rooms[data[0]] == null) {
        return
      }
      let roster = io.sockets.adapter.rooms[data[0]].sockets
      
      const spy = Math.floor((Math.random() * Object.keys(roster).length));

      const location = locations[Math.floor((Math.random() * locations.length))]
     
      // emit to each a starting with the 
      Object.keys(roster).forEach((key, index) => {

        if (index === spy) {
          io.to(key).emit('starting', 'spy')
          // fn({'location': 'spy'})

        }
        else {
          io.to(key).emit('starting', location)
          // fn({'location': location})
        }
      })

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
 
 
// });



http.listen(port, '0.0.0.0', () => {
  console.log('listening on *:'+ port);
});