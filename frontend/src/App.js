import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { NewGame, JoinGame, InGame } from './game.js';
// import socketIOClient from 'socket.io-client';




function App() {

  const in_game = localStorage.getItem('currentGame');

  // var socket = socketIOClient('http://192.168.1.135:3001')
  // socket.on('testing', function (data) { 
  //   console.log(data)
  //   socket.emit('other event', { my:'data'})
  // })
  if (in_game != null) {
    return (
      <InGame game_id={in_game} />
    )
  }
  return (
    <center>
      <button onClick={ () => { createNewGame() }}>New Game</button>
      <button onClick={ () => { joinGame() }}>Join Game</button>
    </center>
  )
}



function createNewGame() {
  ReactDOM.render(<NewGame />, document.getElementById('root'));
}


function joinGame() {
  ReactDOM.render(<JoinGame />, document.getElementById('root'));
}
export default App;
