import React, { Component } from 'react';
import UsersSidebar from './UsersSidebar.js';
import ChatsDisplay from './ChatsDisplay.js';
import { ActionCableConsumer } from 'react-actioncable-provider';

class MessagingDisplay extends Component {
  state = {
    messageInput: '',
    userNameInput: '',
    user:  null,
    chatIds: [],
    messages: [],
    currentChat: null
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
    .then(r => r.json())
    .then(newChat => this.newChatHandler(newChat, 'not null'))
  }

  newChatHandler = (newChat, created = null) => {
    if(created === 'not null'){
      return this.setState({currentChat: newChat.chat.id, chatIds: [newChat.chat.id, ...this.state.chatIds], messages: [...newChat.chat.messages, ...this.state.messages]})
    }
    return this.setState({chatIds: [newChat.chat.id, ...this.state.chatIds], messages: [...newChat.chat.messages, ...this.state.messages]})
  }



  render () {
    console.log(this.state.currentChat)
    return(
      <div>
        <ActionCableConsumer
          channel={{channel: 'ChatChannel', user_id: this.state.user ? this.state.user.id : null}}
          onReceived={newChat => this.newChatHandler(newChat)}
        />
        <UsersSidebar
          users={this.props.users}
          createChat={this.createChat}
        />
        <div className="right">
          <div className="message-board">
            <ChatsDisplay
              chatIds={this.state.chatIds}
              messages={this.state.messages}
              currentChat={this.state.currentChat}
            />
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
