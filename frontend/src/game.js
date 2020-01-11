import React from 'react';
import ReactDOM from 'react-dom';
import './game.css';
import App from './App.js'
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';

// create the socket connection and pass 
// the same one to all instances of the same user
const socket = io('http://localhost:3001')
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

      localStorage.setItem('self', this.state.name)
      
      // render with socket
      ReactDOM.render(<Lobby game_id={room} players={players} />, document.getElementById('root'));

    });
  }


  render() {

    
    return (
        
      <Grid container justify="center" spacing={2}>

        <Grid item>
          <TextField id="filled-size-small" label="Name" variant="filled" size="small" type="text" value={this.state.name} onChange={this.handleChange}></TextField>
        </Grid>

        <Grid item>
          <Button size="small" variant="outlined" color="default"  onClick={() => { this.registerUser() }}>Go</Button>
        </Grid>

      </Grid>
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

        localStorage.setItem('self', this.state.name)

        console.log("successfully joined room")
        
        // render the players       
        ReactDOM.render(<Lobby game_id={room}/>, document.getElementById('root'))
      }
    })
  }

  render() {
    return (
      <Grid container justify="center" spacing={2}>

        <Grid item>
        <TextField label="Game ID"
          id="filled-size-small"
          defaultValue="Small"
          variant="filled"
          size="small" type="text" value={this.state.game_id} onChange={this.handleChangeGameID}></TextField>
        </Grid>
        <Grid item>
        </Grid>
        <Grid item>
        <TextField label="Name"
          id="filled-size-small"
          defaultValue="Small"
          variant="filled"
          size="small" type="text" value={this.state.name} onChange={this.handleChangeName}></TextField> 
        </Grid>
        <Grid item>
          <Button variant="outlined" color="default"  onClick={() => { this.joinGame() }}>Join</Button>
          
        </Grid>

      </Grid>

      
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
    socket.emit('leave', [game, localStorage.getItem('self')])
    localStorage.clear()
    ReactDOM.render(<App />, document.getElementById('root'))
  }

  // starting game
  startGame() {
    const game = localStorage.getItem('currentGame')
    const players = JSON.parse(localStorage.getItem('players'))
    socket.emit('start',  [game, players])
  }


  addPlayerToState(player) {
    this.setState({
      otherPlayers: this.state.otherPlayers.concat(player)
    })
  }

  
  updatePlayerState(players) {
    this.setState({
      otherPlayers: players
    })
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


    socket.on('playerleave', (data) => {
      console.log("player " + data  + ' left the game')
      let players = JSON.parse(localStorage.getItem('players'))
      players = players.filter((e) => { return e !== data })
      
      localStorage.removeItem('players')
      
      localStorage.setItem('players', JSON.stringify(players))

      if (this._isMounted) {
        this.updatePlayerState(players)
      }
    })


    socket.on('starting', (data) => {
      
      localStorage.setItem('in_game', true)
      console.log(data)
      ReactDOM.render(<Playing players={this.state.otherPlayers} role={data}/>, document.getElementById('root'))
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
      <center>

        <div>
          <br/>
          This game: <h1>{this.props.game_id}</h1>

          <h3>Current players</h3>
          <div>
              {this.state.otherPlayers.map((item, index) => {
                return(<li key={index}>{item}</li>)
              })}
          </div>

          <Button size="small" variant="outlined" color="default"  onClick={() => { this.leaveGame() }}>Leave game</Button>

          <Button size="small" variant="outlined" color="default"  onClick={() => { this.startGame() }}>Start game</Button>
        </div>
      </center>
    )
  }
}



export class Playing extends React.Component {


  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      players: this.props.players,
      status: this.props.status,
      role: this.props.role,


      // TODO
      // move this out to a seperate text file and parse it
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
        <h2>You are <u>{this.state.role}</u></h2>
          <center>
            <h1>List of locations</h1>
          </center>
            {this.state.locations.map((item, index) => {
              return (<li key={index}>{item}</li>)
            })}
          <center>
            <h1>List of players</h1>

          </center>
          {this.state.players.map((item, index) => {
            return (<li key={index}>{item}</li>)
          })}

        <Button size="small" variant="outlined" color="default" onClick={() => { this.endGame() }}>End Game</Button>
        </div>
    )
  }
}