import React from 'react';
import { connect } from 'react-redux';

const UsersSidebar = props => (

  <ul>
    {props.users.map(user => <li key={user.name}>
      <h3>{user.name}</h3>
      <button onClick={() => props.createChat(user)}>Start chatting</button>
    </li>)}
  </ul>
)

const mapStateToProps = state => {
  return state
}

export default connect(mapStateToProps)(UsersSidebar);
