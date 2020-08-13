import React, { useState, useEffect, useContext, useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from './firebase.js';
import { Grommet, Header, Button, Menu, Icons } from 'grommet';
import { Notification } from 'grommet-icons';
import Navigation from './component/navigation';
import Chat from './component/sidebar';
import Home from './component/home';
import CreateUser from './component/createuser';
import Login from './component/login';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Context from './context';

const { Provider } = Context;

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

const Consumer = () => {
  const [text, setText] = useState('');
  const { state, dispatch } = useContext(Context);

  return (
    <div>
      <h1>Hello {state.name}</h1>
      <input type="text" value={text} onChange={({ target: { value }})=>{setText(value)}}/>
      <button type="button" onClick={()=>{dispatch({ type: 'SET_NAME', payload: text })}} >Submit</button>
    </div>
    
  );
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    default:
      return state;
  }
}

const initialState = {
  name: 'Jeannette',
  number: '1'
};

// Add the Firebase products that you want to use
function App() {
  const [avatarmessage, setAvatarMessage] = useState('');
  const [updateUserInfo, setUpdateUserInfo] = useState('');

  const [ state, dispatch ] = useReducer(reducer, initialState)

 let updateAvatar = (value) => {
    setAvatarMessage(value)
  }

  let userInfo = (info) => {
    setUpdateUserInfo(info);
  }

  useEffect(()=>{},[avatarmessage]);
  useEffect(()=>{},[updateUserInfo]);

  return (
    <Provider value={{state, dispatch}}>
      {/* <Consumer /> */}
      <Router>
        <Navigation avatarmessage={avatarmessage} />
        <Route
          exact
          path="/"
          render={(props) => (
            <Home {...props} avatarmessage={avatarmessage} isAuthed={true} />
          )}
        />
        <Route
          path="/createuser"
          render={(props) => (
            <CreateUser {...props} isAuthed={true} />
          )}
        />
        <Route
          path="/login"
          render={(props) => (
            <Login {...props} updateAvatar={updateAvatar} userInfo={userInfo} isAuthed={true} />
          )}
        />
        <Route
          path="/conversation"
          render={(props) => (
            <Chat {...props} isAuthed={true} updateUserInfo={updateUserInfo} />
          )}
        />
      </Router>
    </Provider>
  );
}

export default App;
