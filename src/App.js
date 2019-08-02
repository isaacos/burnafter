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
    .then(users => this.setUsers(users))
  }


  setUsers = users => {
    this.setState({users: users})
  }

  render (){
    return (
      <div>
        <ActionCableConsumer
          channel={{channel: 'UsersChannel'}}
          onReceived={users => this.setUsers(users)}
        />
        <MessagingDisplay users={this.state.users}/>
      </div>
    );
  }
}

export default App;
