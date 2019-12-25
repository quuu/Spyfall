import React from 'react';
import './game.css';

export class NewGame extends React.Component{


  render() {
    return (
      <center>

        <input></input>
        <button onClick={() => { registerUser() }}></button>
      </center>
    )
  }
}

export class JoinGame extends React.Component {
  

  render() {
    return (
      <center>

        <input></input>
        <button onClick={() => { joinGame() }}></button>
      </center>
    )
  }
}


function joinGame() {

}
function registerUser() {
  
}
// export default NewGame;
// export default JoinGame;