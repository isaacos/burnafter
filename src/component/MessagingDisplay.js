import React, { Component } from 'react';
import UsersSidebar from './UsersSidebar.js';
import ChatsDisplay from './ChatsDisplay.js';
import { ActionCableConsumer } from 'react-actioncable-provider';

class MessagingDisplay extends Component {
  state = {
    messageInput: '',
    userNameInput: '',
    user:  null,
    chats: [],
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



  deleteUser = () => {
    fetch(`http://localhost:3090/users/${this.state.user.id}`,{
      method: 'DELETE'
    })
    this.setState({user: null, chats: [], messages: [], currentChat: null})
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

  createMessage = () => {
    fetch('http://localhost:3090/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        chat_id: this.state.currentChat.id,
        user_id: this.state.user.id,
        chat_unique_string: this.state.currentChat.unique_string,
        text: this.state.messageInput
      })
    })
  }


  newChatHandler = (newChat, created = null) => {
    //not null is for when the newChat is recieved from the fetch promise instead of the channel
    if(created === 'not null' || this.state.currentChat === null){
      this.setState({currentChat: newChat.chat, chats: [newChat.chat, ...this.state.chats], messages: [...newChat.chat.messages, ...this.state.messages]})
    }
    else {

      this.setState({chats: [newChat.chat, ...this.state.chats], messages: [...newChat.chat.messages, ...this.state.messages]})
    }
  }

  selectChat = chat => {
    this.setState({currentChat: chat})
  }

  newMessageHandler = newMessage => {
    this.setState({messages: [...this.state.messages, newMessage]})
  }



  render () {
    console.log('chats', this.state.chats)
    console.log('messages', this.state.messages )
    console.log('current chat', this.state.currentChat)
    return(
      <div>
        <ActionCableConsumer
          channel={{channel: 'ChatChannel', user_id: this.state.user ? this.state.user.id : null}}
          onReceived={newChat => this.newChatHandler(newChat)}
        />
        {this.state.chats.map(chat =>  <div style={{display: 'none'}} key={'chatId' + chat.id}><ActionCableConsumer
          channel={{channel: 'MessageChannel', unique_string: chat.unique_string}}
          onReceived={newMessage => this.newMessageHandler(newMessage)}
          />
          </div>
        )}
        <UsersSidebar
          users={this.props.users}
          createChat={this.createChat}
        />
        <div className="right">
          <div className="message-board">
            <ChatsDisplay
              chats={this.state.chats}
              messages={this.state.messages}
              currentChat={this.state.currentChat}
              selectChat={this.selectChat}
            />
          </div>
          {this.state.user ?
            <div>
              <h3>{this.state.user.name}</h3>
              <input type="text" onChange={e => this.setState({messageInput: e.target.value})}/>
              <button onClick={() => this.createMessage()}>Send</button>
              <button onClick={()=> this.deleteUser()}>logout</button>
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
