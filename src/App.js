import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import MessagingDisplay from './component/MessagingDisplay.js';
import UsersSidebar from './component/UsersSidebar.js';
import { ActionCable } from 'react-actioncable-provider';


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
        <ActionCable
        channel={{channel: 'UsersChannel'}}
        onReceived={newUser => this.setState({users: [newUser, ...this.state.users]})}
        />
        <UsersSidebar users={this.state.users} />
        <MessagingDisplay />
      </div>
    );
  }
}

export default App;
