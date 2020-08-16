import React, { useState } from "react";
import "./App.css";
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import Navigation from "./component/navigation";
import Chat from "./component/sidebar";
import Home from "./component/home";
import CreateUser from "./component/createuser";
import Login from "./component/login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Add the Firebase products that you want to use
function App() {
  const [avatarmessage, setAvatarMessage] = useState("");
  const [updateUserInfo, setUpdateUserInfo] = useState("");

  let updateAvatar = (value) => {
    setAvatarMessage(value);
  };

  let userInfo = (info) => {
    setUpdateUserInfo(info);
  };

  return (
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
        render={(props) => <CreateUser {...props} isAuthed={true} />}
      />
      <Route
        path="/login"
        render={(props) => (
          <Login
            {...props}
            updateAvatar={updateAvatar}
            userInfo={userInfo}
            isAuthed={true}
          />
        )}
      />
      <Route
        path="/conversation"
        render={(props) => (
          <Chat {...props} isAuthed={true} updateUserInfo={updateUserInfo} />
        )}
      />
    </Router>
  );
}

export default App;
