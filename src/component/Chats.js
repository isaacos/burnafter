import React, { Component } from 'react';

const Chats = props => (
  <ul>
    {props.chatIds.map(chatId => <li key={chatId}>{chatId}</li>)}
  </ul>
)

export default Chats;
