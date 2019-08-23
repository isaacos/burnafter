import React, { Component } from 'react';
import UsersSidebar from './UsersSidebar.js';
import ChatsDisplay from './ChatsDisplay.js';
import CountdownClock from './CountdownClock.js';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { connect } from 'react-redux';

class MessagingDisplay extends Component {
  state = {
    messageInput: '',
    userNameInput: '',
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
    .then(currentUser => this.props.loginUser(currentUser))
  }

  deleteUser = () => {
    fetch(`http://localhost:3090/users/${this.props.user.id}`,{
      method: 'DELETE'
    })
    .then(r => r.json())
    .then(r => r)
    this.props.logOutUser()
  }

  createChat = secondUser => {
    fetch('http://localhost:3090/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_user: this.props.user.id,
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
        chat_id: this.props.currentChat.id,
        user_id: this.props.user.id,
        chat_unique_string: this.props.currentChat.unique_string,
        text: this.state.messageInput
      })
    })
  }


  newChatHandler = (newChat, created = null) => {
    //not null is for when the newChat is recieved from the fetch promise instead of the channel
    if(created === 'not null' || this.props.currentChat === null){
      this.props.newChatWithNullCurrentChat(newChat.chat, newChat.chat.messages)
    }
    else {
      this.props.newChat(newChat.chat, newChat.chat.messages)
    }
  }



  render () {
    return(
      <div>
        <ActionCableConsumer
          channel={{channel: 'ChatChannel', user_id: this.props.user ? this.props.user.id : null}}
          onReceived={newChat => this.newChatHandler(newChat)}
        />
        {this.props.chats.map(chat => {
            return <div style={{display: 'none'}} key={'chatId' + chat.id}>
            <ActionCableConsumer
              channel={{channel: 'MessageChannel', unique_string: chat.unique_string}}
              onReceived={newMessage => this.props.newMessageHandler(newMessage)}
            />
          </div>
          }
        )}
          <div className="right">
            <div className="message-board">
              <ChatsDisplay/>
            </div>
            {this.props.user ?
              <div>
                <h3>{this.props.user.name}</h3>
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
            <UsersSidebar
              createChat={this.createChat}
            />
            <CountdownClock />
        </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = {
  loginUser: (user) => ({type: 'LOGINUSER', user}),
  newChat: (chats, messages) => ({type: 'NEWCHAT', chats, messages}),
  newChatWithNullCurrentChat: (chats, messages) => ({type: 'NEWCHATWITHNULLCURRENTCHAT', chats, messages}),
  newMessageHandler: (message) => ({type: 'NEWMESSAGE', message}),
  logOutUser: () => ({type: 'LOGOUTUSER'})
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagingDisplay);
