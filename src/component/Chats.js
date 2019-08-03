import React from 'react';
import { connect } from 'react-redux';


function Chats (props){
  return (
    <ul>
      {props.chats.map(chat => <li onClick={() => props.dispatch({type: 'SELECTCHAT', chat})} key={chat.unique_string}>
        {chat.id}
      </li>)}
    </ul>
  )
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(Chats);
