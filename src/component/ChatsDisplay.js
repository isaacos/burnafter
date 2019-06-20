import React, { Component } from 'react';
import Chats from './Chats.js';

class ChatsDisplay extends Component {

  render(){
    return(
      <div>
        <div className="chats">
          <Chats
            chats={this.props.chats}
            selectChat={this.props.selectChat}
          />
        </div>
        <ul>
          {this.props.messages.map(message => {
            if(message.chat_unique_string === this.props.currentChat.unique_string){
              return <li key={'k'+message.id}>{message.text}</li>
            }
          })}
        </ul>

      </div>
    )
  }
}

export default ChatsDisplay
