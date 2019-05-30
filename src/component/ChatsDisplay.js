import React, { Component } from 'react';
import Messages from './Messages.js';
import Chats from './Chats.js';

class ChatsDisplay extends Component {

  render(){
    return(
      <div>
        <div className="chats">
          <Chats
            chatIds={this.props.chatIds}
          />
        </div>
        <ul>
          {this.props.messages.map(message => {
            if(message.chat_id === this.props.currentChat){
              return <li key={'k'+message.id}>{message.text}</li>
            }
          })}
        </ul>

      </div>
    )
  }
}

export default ChatsDisplay
