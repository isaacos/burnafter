import React, { Component } from 'react';
import Chats from './Chats.js';
import { connect } from 'react-redux';

class ChatsDisplay extends Component {

  render(){
    return(
      <div>
        <div className="chats">
          <Chats
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

const mapStateToProps = state => {
  return state
}



export default connect(mapStateToProps)(ChatsDisplay);
