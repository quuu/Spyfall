import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { NewGame, JoinGame } from './game.js';




function App() {
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
