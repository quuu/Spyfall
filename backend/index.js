const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const app = express()

const url = 'mongodb://localhost:27017';



const port = 3000


MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
  assert.equal(null, err);
  const db = client.db('spyfall');
  const collec = db.collection('spyfall');
  db.eventlog.createIndex({ "lastModifiedDate": 1 }, { expireAfterSeconds: 3600 })
  console.log("Connected successfully to server");

  app.get('/', (req, res) => res.send('Testing World!'))


  // responsible for creating a new unique id for a game and expring it
  app.get('/newgame', (req, res) => {

    const uuid = uuidv4();

    collec.insertOne()


    


    
    // generate uuid for game

  })


  // repsonsible for verying a game and joining it
  app.get(['/joingame', (req, res) => {

    // if uuid is legit, join it

  }])
 
 
  client.close();
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
