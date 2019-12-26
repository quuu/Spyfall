import React from 'react';
import './game.css';



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
    this.setState({name: event.target.name});
  }

  registerUser() {
    // call lobby component with the user name
    console.log(this.state.name)
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


function joinGame() {

}
function registerUser() {

}
// export default NewGame;
// export default JoinGame;