import React from 'react';
import { connect } from 'react-redux';

function Chats (props){
  
  function displayUserName(chat){
    let name = "Name Issue"
    chat.users.forEach(user => {
      if(user.name !== props.user.name){
        name = user.name
      }
    })
    return name
  }

  return (
    <ul>
      {props.chats.map(chat => <li onClick={() => props.dispatch({type: 'SELECTCHAT', chat})} key={chat.unique_string}>
        {displayUserName(chat)}
      </li>)}
    </ul>
  )
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(Chats);
