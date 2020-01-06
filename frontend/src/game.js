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
      console.log(details)
      // if succesfully joined
      if (details['success'] === "joined room") {

        // set local storage game variable
        const room = details['room']
        localStorage.setItem('currentGame', room)

        // set players currently in lobby
        const players = details['players']
        localStorage.setItem('players', JSON.stringify(players))

        console.log("successfully joined room")
        
        // render the players       
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

    const players = JSON.parse(localStorage.getItem('players'))
    super(props)
    this.state = {
      game_id: '',
      otherPlayers: players
    }
  }

  // leaving game
  leaveGame() {
    const game = localStorage.getItem('currentGame')
    // socket.off('newplayer')
    socket.emit('leave', game )
    localStorage.clear()
    ReactDOM.render(<App />, document.getElementById('root'))
  }

  // starting game
  startGame() {
    const game = localStorage.getItem('currentGame')
    socket.emit('start',  game)
  }


  addPlayerToState(player) {
    this.setState({
      otherPlayers: this.state.otherPlayers.concat(player)
    })
  }

  removePlayerFromState() {
    
  }

  componentDidMount() {
    this._isMounted = true


    // check to make sure currently in game
    const currentGame = localStorage.getItem('currentGame')
    if (currentGame != null) {
      socket.emit('rejoin', currentGame, function (details) {
        console.log(details)
      })
    }


    // const players = JSON.parse(localStorage.getItem('players'))
    // for (let i = 0; i < players.length; i++){
    //   this.setState({
    //     otherPlayers: [...this.state.otherPlayers, (players[i])]
    //   })
    //   console.log(this.state.otherPlayers)
    // }
    






    // on new player
    socket.on('newplayer', (data) => {
      console.log(data)
      // data contains the name of the new user

      // get the current players
      let players = JSON.parse(localStorage.getItem('players'))

      // append the newest player to the list
      players.push(data)

      // clear the storage 
      localStorage.removeItem('players')

      // set the player array
      localStorage.setItem('players', JSON.stringify(players))
      
      if (this._isMounted) {
        this.forceUpdate()
      }
    })
  }


  componentWillUnmount(){
    this._isMounted = false


    // remove the listener since it is a single page app
    socket.off('newplayer')
  }


  sendSelf() {
    socket.emit('test', function (data) {
      console.log('received self test')
      console.log(data)
    })
  }


  render() {

    return (
      <div>
        <h1>You are currently in a game</h1>
        <br/>
        <h1>{this.props.game_id}</h1>

        <h1>Current players</h1>
        <div>
            {this.state.otherPlayers.map((item, index) => {
              return(<li key={index}>{item}</li>)
            })}
        </div>

        <button onClick={() => { this.leaveGame() }}>Leave game</button>

        <button onClick={() => { this.startGame() }}>Start game</button>
        <button onClick={() => { this.sendSelf() }}>Self test</button>
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