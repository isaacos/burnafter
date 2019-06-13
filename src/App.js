import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import MessagingDisplay from './component/MessagingDisplay.js';
import { ActionCableConsumer } from 'react-actioncable-provider';


class App extends Component {
  state = {
    users: []
  }



  componentDidMount(){
    fetch('http://localhost:3090/users')
    .then(r => r.json())
    .then(r => this.setState({users: r}))
  }





  render (){
    return (
      <div>
        <ActionCableConsumer
        channel={{channel: 'UsersChannel'}}
        onReceived={newUser => this.setState({users: [newUser, ...this.state.users]})}
        />
        <div id="message-display-sidebar">

          <MessagingDisplay users={this.state.users}/>
        </div>
      </div>
    );
  }
}

export default App;
