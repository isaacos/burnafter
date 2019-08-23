import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import { createStore} from 'redux'
import * as serviceWorker from './serviceWorker';
import { ActionCableProvider } from 'react-actioncable-provider';

const reducer = (state = {users: [], user: null, chats: [], currentChat: null, messages: [], loginTime: -1}, action) => {
  switch(action.type){
    case 'SETUSERS':
      return {...state, users: action.users}
    case 'LOGINUSER':
      return {...state, user: action.user, loginTime: Math.round(new Date().getTime()/ 1000)}
    case 'NEWCHAT':
      return {...state, chats: [action.chats, ...state.chats], messages: [...state.messages, ...action.messages]}
    case 'NEWCHATWITHNULLCURRENTCHAT':
      return {...state, currentChat: action.chats, chats: [action.chats, ...state.chats], messages: [...state.messages, ...action.messages]}
    case 'NEWMESSAGE':
      return {...state, messages: [...state.messages, action.message]}
    case 'LOGOUTUSER':
      return {...state, user: null, chats: [], messages: [], currentChat: null}
    case 'SELECTCHAT':
      return {...state, currentChat: action.chat}
    case 'CHANGELOGINTIME':
      return {...state, loginTime: Math.round(new Date().getTime()/ 1000) }
    default:
      return state
  }
}

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
      <ActionCableProvider url="ws://localhost:3090/chat">
          <ActionCableProvider url="ws://localhost:3090/message">
              <App />
          </ActionCableProvider>
      </ActionCableProvider>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
