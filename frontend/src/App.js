import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import {NewGame, JoinGame} from './game.js';



export const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/newgame" component={NewGame}/>
      <Route path="/joingame" component={JoinGame}/>
    </div>
  </Router>
)
function App() {
  return (
    <center>
      <h1>Welcome to Spyfall</h1>
      <ul>
        <li>
          <Link to="/newgame">New Game</Link>
        </li>
        <li>
          <Link to="/joingame">Join Game</Link>
        </li>
      </ul>

    </center>
    // <center>
    //   <button onClick={ () => { createNewGame() }}>New Game</button>
    //   <button onClick={ () => { joinGame() }}>Join Game</button>
    // </center>
  )
}



// function createNewGame() {
//   ReactDOM.render(<NewGame />, document.getElementById('root'));
// }


// function joinGame() {
//   ReactDOM.render(<JoinGame />, document.getElementById('root'));
// }
export default App;
