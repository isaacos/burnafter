import React, { Component } from 'react';

class MessagingDisplay extends Component {
  state = {
    input: ''
  }


  render () {
    return(
      <div>
        <div className="right">
          <div className="message-board">
          </div>
          <input type="text" />
          <button>Send</button>
        </div>
      </div>
    )
  }
}

export default MessagingDisplay;
