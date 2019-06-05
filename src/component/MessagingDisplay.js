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
    currentChatId: null
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

  createMessage = () => {
    fetch('http://localhost:3090/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        chat_id: this.state.currentChatId,
        user_id: this.state.user.id,
        text: this.state.messageInput
      })
    })
  }

  newChatHandler = (newChat, created = null) => {
    if(created === 'not null' || this.state.currentChatId === null){
      this.setState({currentChatId: newChat.chat.id, chatIds: [newChat.chat.id, ...this.state.chatIds], messages: [...newChat.chat.messages, ...this.state.messages]})
    } else {

      this.setState({chatIds: [newChat.chat.id, ...this.state.chatIds], messages: [...newChat.chat.messages, ...this.state.messages]})
    }
  }

  selectChat = chatId => {
    this.setState({currentChatId: chatId})
  }

  newMessageHandler = newMessage => {
    this.setState({messages: [...this.state.messages, newMessage]})
  }



  render () {
    console.log(this.state.currentChatId)
    return(
      <div>
        <ActionCableConsumer
          channel={{channel: 'ChatChannel', user_id: this.state.user ? this.state.user.id : null}}
          onReceived={newChat => this.newChatHandler(newChat)}
        />
        {this.state.chatIds.map(chatId =>  <div style={{display: 'none'}} key={'chatId' + chatId}><ActionCableConsumer
          channel={{channel: 'MessageChannel', chat_id: chatId}}
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
              chatIds={this.state.chatIds}
              messages={this.state.messages}
              currentChatId={this.state.currentChatId}
              selectChat={this.selectChat}
            />
          </div>
          {this.state.user ?
            <div>
              <h3>{this.state.user.name}</h3>
              <input type="text" onChange={e => this.setState({messageInput: e.target.value})}/>
              <button onClick={() => this.createMessage()}>Send</button>
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
