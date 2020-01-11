import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { NewGame, JoinGame, Lobby } from './game.js';
import Button from '@material-ui/core/Button';

const App = () => {


  // checks to see when last visit was
  // after 2 hours, clear the storage on next visit
  let hours = 2
  let saved = localStorage.getItem('saved')
  if (saved && (new Date().getTime() - saved > hours * 60 * 60 * 1000)) {
    localStorage.clear()
  }


  // get current game
  const in_game = localStorage.getItem('currentGame');

  // start new saved timer
  localStorage.setItem('saved', new Date().getTime())

  if (in_game != null) {
    return (
      <Lobby game_id={in_game} />
    )
  }
  return (
    <center>
      <h1>Spyfall</h1>
      <Button size="small" variant="outlined" color="primary" onClick={() => { createNewGame() }}>New Game</Button>
      <br/>
      <Button size="small" variant="outlined" color="default" onClick={() => { joinGame() }}>Join Game</Button>
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
