import React from 'react';
import ReactDOM from 'react-dom';
import './game.css';
import App from './App.js'
import socketIOClient from 'socket.io-client';


// create the socket connection and pass 
// the same one to all instances of the same user
const socket = socketIOClient('http://192.168.1.135:3001')
export default socket;

socket.on('starting', function (data) {
  console.log("starting from server")
})

socket.on('ending', function (data) {
  console.log("game ending from server")
})



// handles creating a new game
export class NewGame extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }


  // creates new game and puts player in lobby
  registerUser() {

    // emit a create signal
    socket.emit('create', this.state.name, function (details) {
      const room = details['room']
      localStorage.setItem('currentGame', room)

      const players = details['players']
      
      // render with socket
      ReactDOM.render(<InGame game_id={room} players={players} />, document.getElementById('root'));

    });
  }


  render() {

    
    return (
      <center>

        Name<input type="text" value={this.state.name} onChange={this.handleChange}></input>
        <button onClick={() => { this.registerUser() }}>Go</button>
      </center>
    )
  }
}

export class JoinGame extends React.Component {

  
  constructor(props) {
    super(props)
    this.state = {
      game_id: '',
      name: '',
    }

    this.handleChangeGameID = this.handleChangeGameID.bind(this);
    this.handleChangeName= this.handleChangeName.bind(this);
  }

  handleChangeGameID(event) {
    this.setState({ game_id: event.target.value });
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  joinGame() {
    socket.emit('join', [this.state.game_id, this.state.name], function (details) {
      const room = details['room']
      if (details['success'] === "joined room") {
        localStorage.setItem('currentGame', room)
        console.log("successfully joined room")
        ReactDOM.render(<InGame game_id={room}/>, document.getElementById('root'))
      }
    })
  }

  render() {
    return (
      <center>

        Game ID<input type="text" value={this.state.game_id} onChange={this.handleChangeGameID}></input>
        <button onClick={() => { this.joinGame() }}>Join</button>

        Name<input type="text" value={this.state.name} onChange={this.handleChangeName}></input>

      </center>
    )
  }
}

export class InGame extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      game_id: '',
      otherPlayers: []
    }
  }

  // leaving game
  leaveGame() {
    const game = localStorage.getItem('currentGame')
    socket.emit('leave', game)
    localStorage.clear()
    ReactDOM.render(<App />, document.getElementById('root'))
  }

  // starting game
  startGame() {
    const game = localStorage.getItem('currentGame')
    socket.emit('start',  game)
  }


  render() {

    socket.on('newplayer', function (data) {
      console.log(data);
      console.log("new player")

    })

    // for (let i = 0; i < this.props.players.length; i++){
    //   array.push(<h2 key={i}>{this.props.players[i]}</h2>)
    // }
    return (
      <div>
        <h1>You are currently in a game</h1>
        <br/>
        <h1>{this.props.game_id}</h1>

        <h1>Current players</h1>
        {/* <div>
          {array}
        </div> */}

        <button onClick={() => { this.leaveGame() }}>Leave game</button>

        <button onClick={() => { this.startGame() }}>Start game</button>
      </div>
    )
  }
}