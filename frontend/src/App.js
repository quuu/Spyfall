import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { NewGame, JoinGame, Lobby } from './game.js';


const App = () => {

  const in_game = localStorage.getItem('currentGame');

  if (in_game != null) {
    return (
      <Lobby game_id={in_game} />
    )
  }
  return (
    <center>
      <h1>Spyfall</h1>
      <button onClick={ () => { createNewGame() }}>New Game</button>
      <button onClick={() => { joinGame() }}>Join Game</button>
    </center>
  )
}



const createNewGame = () => {
  ReactDOM.render(<NewGame />, document.getElementById('root'));
}


const joinGame = () => {
  ReactDOM.render(<JoinGame />, document.getElementById('root'));
}

export default App;
