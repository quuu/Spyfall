import React from 'react';
import ReactDOM from 'react-dom';
import './game.css';
import App from './App.js'
import socketIOClient from 'socket.io-client';



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

  registerUser() {
    // call lobby component with the user name
    fetch('http://127.0.0.1:3001/newgame', {
      method: 'POST',
      body: JSON.stringify({
        'name': this.state.name
      }),
      // mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      }
    }).then((resp) => resp.json())
      .then(function (data) {
        
        localStorage.setItem('currentGame', 'yes')
        const game = data['room']
        ReactDOM.render(<InGame game_id={game}/>, document.getElementById('root'));
        // render new room

    })
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
    }
  }

  handleChange(event) {
    this.setState({game_id: event.target.game_id});
  }

  render() {
    return (
      <center>

        Game ID<input type="text" value={this.state.game_id} onChange={this.handleChange}></input>
        <button onClick={() => { joinGame() }}>Join</button>

        Name<input type="text" name="name"></input>

      </center>
    )
  }
}

export class InGame extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      game_id: '',
    }
  }


  render() {
    
    let socket = socketIOClient('http://192.168.1.135:3001')
    socket.on('testing', function (data) {
      console.log('got it')
    })
    return (
      <div>
        <h1>You are currently in a game</h1>
        <br/>
        <h1>{this.props.game_id}</h1>

        <button onClick={() => { localStorage.clear(); ReactDOM.render(<App/>, document.getElementById('root'))}}>Leave game</button>
      </div>
    )
  }
}


function joinGame() {

}
// export default NewGame;
// export default JoinGame;