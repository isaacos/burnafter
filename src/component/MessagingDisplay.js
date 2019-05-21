import React, { Component } from 'react';

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
  }



  render () {
    return(
      <div>
        <div className="right">
          <div className="message-board">
          </div>
          <input type="text" />
          <button>Send</button>
          <input placeholder='user name' onChange={e => this.setState({userNameInput: e.target.value})}/>
          <button onClick={() => this.createUser()}>activate</button>
        </div>
      </div>
    )
  }
}

export default MessagingDisplay;
