import React from 'react';
import ReactDOM from 'react-dom';
import './game.css';
import App from './App.js'
import io from 'socket.io-client';


// create the socket connection and pass 
// the same one to all instances of the same user
const socket = io('http://192.168.1.144:3001')
export default socket;

// event listening for starting a game and ending a game
socket.on('starting', function (data) {
  console.log("starting from server")
})

socket.on('ending', function (data) {
  console.log("game ending from server")
})



// component responsible for creating a new game
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
      localStorage.setItem('players', JSON.stringify(players))
      
      // render with socket
      ReactDOM.render(<InGame game_id={room}/>, document.getElementById('root'));

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

// component responsible for joining an existing game
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

  // handle changing input fields
  handleChangeGameID(event) {
    this.setState({ game_id: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  // joining game
  joinGame() {
    socket.emit('join', [this.state.game_id, this.state.name], function (details) {
      // console.log(details)
      // if succesfully joined
      if (details['success'] === "joined room") {

        // set local storage game variable
        const room = details['room']
        localStorage.setItem('currentGame', room)

        // set players currently in lobby
        const players = details['players']
        localStorage.setItem('players', JSON.stringify(players))

        // console.log("successfully joined room")
        
        // render the room 
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

  _isMounted = false

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
    socket.emit('leave', game )
    localStorage.clear()
    ReactDOM.render(<App />, document.getElementById('root'))
  }

  // starting game
  startGame() {
    const game = localStorage.getItem('currentGame')
    socket.emit('start',  game)
  }


  removePlayerFromState() {
    
  }

  componentDidMount() {
    this._isMounted = true
    
   

    const currentGame = localStorage.getItem('currentGame')
    if (currentGame != null) {
      socket.emit('rejoin', currentGame, function (details) {
        console.log(details)
      })
    }


    // on new player
    socket.on('newplayer', (data) => {
      console.log(data)
      // data contains the name of the new user

      // get the current players
      let players = JSON.parse(localStorage.getItem('players'))

      // append the newest player to the list
      console.log("players looks like before ")
      console.log(players)
      players.push(data)
      console.log("players looks like  after")
      console.log(players)

      // clear the storage 
      localStorage.removeItem('players')

      // set the player array
      localStorage.setItem('players', JSON.stringify(players))
      
      // add player to list to display
      //  playersList.push(<h3 key={data}>{data}</h3>)
      // this.setState({
      //     otherPlayers: this.state.otherPlayers.concat(data)
      //   })
      if (this._isMounted) {
        this.forceUpdate()
      }
    })
  }


  componentWillUnmount(){
    this._isMounted = false
  }


  render() {

    return (
      <div>
        <h1>You are currently in a game</h1>
        <br/>
        <h1>{this.props.game_id}</h1>

        <h1>Current players</h1>
        <div>
          {JSON.parse(localStorage.getItem('players'))}
        </div>

        <button onClick={() => { this.leaveGame() }}>Leave game</button>

        <button onClick={() => { this.startGame() }}>Start game</button>
      </div>
    )
  }
}













export class Playing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }


  render() {
    return (
      <h1>List of locations</h1>
    )
  }
}