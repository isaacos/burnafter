import React, { Component } from 'react';

const UsersSidebar = props => (

  <ul>
  {props.users.map(user => <li key={user.name}>
      <h3>{user.name}</h3>
      <button onClick={() => props.createChat(user)}>Start chatting</button>
    </li>)}
  </ul>
)

export default UsersSidebar;
