import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux'
import MessagingDisplay from './component/MessagingDisplay.js';


class App extends Component {

  componentDidMount(){
    fetch('http://localhost:3090/users')
    .then(r => r.json())
    .then(users => this.props.setUsers(users))
  }



  render (){
    return (
      <div>
        <MessagingDisplay />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = {
  setUsers: (users) => ({type: 'SETUSERS', users})
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
