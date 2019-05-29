import React, { Component } from 'react';
import UsersSidebar from './UsersSidebar.js';
import Messages from './Messages.js';
import { ActionCableConsumer } from 'react-actioncable-provider';

class MessagingDisplay extends Component {
  state = {
    messageInput: '',
    userNameInput: '',
    user:  null
  }

  createUser = () => {
    fetch('http://localhost:3090/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userNameInput
      })
    })
    .then(r => r.json())
    .then(currentUser => this.setState({user: currentUser}))
  }

  createChat = secondUser => {
    fetch('http://localhost:3090/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_user: this.state.user.id,
        second_user: secondUser.id
      })
    })
  }



  render () {
    return(
      <div>
      <ActionCableConsumer
      channel={{channel: 'ChatChannel'}}
      onReceived={newChat => console.log(newChat)}
      />
        <UsersSidebar  users={this.props.users} createChat={this.createChat}/>
        <div className="right">
          <div className="message-board">
          <Messages />
          </div>
          {this.state.user ?
            <div>
              <h3>{this.state.user.name}</h3>
              <input type="text" />
              <button>Send</button>
            </div>
            :
            <p>
              <input placeholder='user name' onChange={e => this.setState({userNameInput: e.target.value})}/>
              <button onClick={() => this.createUser()}>activate</button>
            </p>
          }
        </div>
      </div>
    )
  }
}

export default MessagingDisplay;
