import React, { Component } from 'react';

const UsersSidebar = props => (

  <div>
  {props.users.map(user => <div key={user.name}>
      <h3>{user.name}</h3>
      <button>Start chatting</button>
    </div>)}
  </div>
)

export default UsersSidebar;
