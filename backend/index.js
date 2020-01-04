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

  app.get('/', (req, res) => res.send('Testing World!'))

  io.on('connection', function (socket) {
    console.log("a user connected")
    console.log(socket)
    socket.on('disconnect', function () {
      console.log('a user disconnected')
    })
  })


  // responsible for creating a new unique id for a game and expring it
  app.post('/newgame', (req, res) => {


    const uuid = uuidv4();

    // create the room code
    // as a substring of the entire uuid
    const roomCode = uuid.substr(0,5)

    console.log(req.body)
    // const name = req.body.


    let players = []
    

    db.collection('games').insertOne({'gamename': roomCode, 'players':[]}, function (err, items) {
      if (err != null) {
        return console.log(err)
      }
      console.log("successfully registered game " + roomCode)
      // console.log(err)
      // console.log(items)
    })


    // res.send({"room":uuid.substr(0,5)})
    


    // generate uuid for game

  })


  // repsonsible for verying a game and joining it
  app.get(['/joingame', (req, res) => {

    // if uuid is legit, join it

  }])
 
 
});



http.listen(port, function(){
  console.log('listening on *:'+ port);
});