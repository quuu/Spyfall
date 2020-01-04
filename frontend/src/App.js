import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { NewGame, JoinGame, InGame } from './game.js';



function App() {

  const in_game = localStorage.getItem('currentGame');

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
