const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const url = 'mongodb://localhost:27017';



const port = 3001


MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  assert.equal(null, err);
  const db = client.db('spyfall');

  db.collection('games').dropIndex({ "created": 1 })

  db.collection('games').createIndex({ "created": 1 }, { expireAfterSeconds: 50000 })

  console.log("Connected successfully to server");

  app.get('/', (req, res) => res.send('Testing World!'))

  io.on('connection', function (socket) {
    console.log("a user connected")
    console.log(socket)
    socket.on('disconnect', function () {
      console.log('a user disconnected')
    })
  })


  // responsible for creating a new unique id for a game and expring it
  app.get('/newgame', (req, res) => {

    const uuid = uuidv4();

    console.log(uuid)


    let players=[]

    db.collection('games').insertOne({'gamename': uuid.toString(), 'players':[]}, function (err, items) {
      if (err != null) {
        return console.log(err)
      }
      // console.log(err)
      // console.log(items)
    })

    res.send('Created new game')

    


    // generate uuid for game

  })


  // repsonsible for verying a game and joining it
  app.get(['/joingame', (req, res) => {

    // if uuid is legit, join it

  }])
 
 
});



http.listen(port, function(){
  console.log('listening on *:3000');
});