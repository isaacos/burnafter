import React, { Component } from 'react';


const Chats = props => (
  <ul>
    {props.chats.map(chat => <li onClick={() => props.selectChat(chat)} key={chat.unique_string}>
      {chat.id}
    </li>)}
  </ul>
)

export default Chats;
