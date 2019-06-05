import React, { Component } from 'react';


const Chats = props => (
  <ul>
    {props.chatIds.map(chatId => <li onClick={() => props.selectChat(chatId)} key={chatId}>
      {chatId}
    </li>)}
  </ul>
)

export default Chats;
