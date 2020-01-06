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
    socket.emit('create', this.state.name, (details) => {
      const room = details['room']
      localStorage.setItem('currentGame', room)

      const players = details['players']
      localStorage.setItem('players', JSON.stringify(players))
      
      // render with socket
      ReactDOM.render(<Lobby game_id={room} players={players} />, document.getElementById('root'));

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
    socket.emit('join', [this.state.game_id, this.state.name], (details) =>  {
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
        ReactDOM.render(<Lobby game_id={room}/>, document.getElementById('root'))
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

export class Lobby extends React.Component {

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
      socket.emit('rejoin', currentGame, (details) => {
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
      players.push(data)

      // clear the storage 
      localStorage.removeItem('players')

      // set the player array
      localStorage.setItem('players', JSON.stringify(players))

      // update state
      this.addPlayerToState(data)
      
      if (this._isMounted) {
        this.forceUpdate()
      }
    })

    socket.on('starting', (data) => {
      
      localStorage.setItem('in_game', true)
      ReactDOM.render(<Playing players={this.state.otherPlayers}/>, document.getElementById('root'))
    })
  }


  componentWillUnmount(){
    this._isMounted = false


    // remove the listener since it is a single page app
    socket.off('newplayer')

    socket.off('starting')
  }


  sendSelf() {
    socket.emit('test', (data) => {
      console.log('received self test')
      console.log(data)
    })
  }


  render() {


    if (localStorage.getItem('in_game')  === 'true') {
      console.log("in game")
      return (
        <Playing players={this.state.otherPlayers}/>
      )
    }

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


  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      players: this.props.players,

      locations: [
        'Airplane',
        'Bank',
        'Beach',
        'Broadway Theater',
        'Casino',
        'Cathedral',
        'Circus Tent',
        'Corporate Party',
        'Crusader Army',
        'Day Spa',
        'Embassy',
        'Hospital',
        'Hotel',
        'Military Base',
        'Movie Studio',
        'Ocean Liner',
        'Passenger Train',
        'Pirate Ship',
        'Polar Station',
        'Police Station',
        'Restaurant',
        'School',
        'Service Station',
        'Space Station',
        'Submarine',
        'Supermarket',
        'University']
    }
  }


  
  endGame() {


    // emit socket signal to end the game
    // have server catch and send to everyone else
    socket.emit('end', localStorage.getItem('currentGame'))



  }

  componentDidMount() {

    this._isMounted = true

    socket.on('ending', (data) => {

      console.log("game ending from server")
      localStorage.setItem('in_game', false)
      ReactDOM.render(<Lobby game_id={localStorage.getItem('currentGame')}/>, document.getElementById('root'))
    })
  }


  componentWillUnmount() {
    
    this._isMounted = false 

    socket.off('end')
  }

  render() {
    return (
      <div>

        <h1>List of locations</h1>
        {this.state.locations.map((item, index) => {
          return (<li key={index}>{item}</li>)
        })}
        <h1>List of players</h1>
        {this.state.players.map((item, index) => {
          return (<li key={index}>{item}</li>)
        })}

        <button onClick={() => { this.endGame() }}>End Game</button>
      </div>
    )
  }
}