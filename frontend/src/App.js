import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import {NewGame, JoinGame} from './game.js';


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
  console.log('testing on click')
}
export default App;
