import React, { useEffect } from "react";
import {
  Grommet,
  AnnounceContext,
  Button,
  Box,
  Form,
  FormField,
  TextInput,
  Text,
  Heading,
} from "grommet";
import { grommet } from "grommet/themes";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from "../firebase.js";
import axios from "axios";
import { Google, Mail } from "grommet-icons";
import "../App.scss";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

// Add the Firebase products that you want to use
function Login(props) {
  const [emailLogin, setEmailLogin] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  useEffect(() => {}, [data]);

  const axiosCheckLogin = (isgoogleauthenticate, email, password) => {
    if (password) {
      // check email authentication
      axios
        .get("/user/checkemail", {
          params: { email, isgoogleauthenticate, password },
        })
        .then((res) => {
          // update avatar
          // update message
          // update username and email
          if (res.data.length !== 0) {
            setMessage("Logged In");
            props.updateAvatar(res.data[0].username.slice(0, 1).toUpperCase());
            props.userInfo(res.data[0].username);
          } else {
            setMessage("Account Not Found");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // check google authentication only
      axios
        .get("/user/checkemail", { params: { email, isgoogleauthenticate } })
        .then((res) => {
          if (res.data.length !== 0) {
            setMessage("Logged In");
            props.updateAvatar(res.data[0].username.slice(0, 1).toUpperCase());
            props.userInfo(res.data[0].username);
          } else {
            setMessage("Account Not Found");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //on click apply
  const applyGoogleAuthentication = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // able to sign in with google
        const user = result.user;
        const newUser = {
          username: user.displayName,
          email: user.email,
          isgoogleauthenticate: true,
        };
        setData(newUser);
        axiosCheckLogin(true, user.email);
      })
      .catch(
        // not able to signin
        (error) => {
          console.log(error, "error");
        }
      );
  };

  const applyEmail = (value) => {
    const newUser = value;
    newUser.isgoogleauthenticate = false;
    setData(newUser);
    axiosCheckLogin(false, value.email, value.password);
  };

  const Announcer = ({ announce, message, mode, role }) => {
    React.useEffect(() => {
      const timeout = 5000;
      announce(message, mode, timeout);
    }, [announce, message, mode]);

    return (
      <Text align="center" role={role} aria-live={mode}>
        {message}
      </Text>
    );
  };

  return (
    <Grommet theme={grommet}>
      <Box
        direction="column"
        height={{ min: "calc(100vh - 72px)" }}
        justify="center"
        align="center"
        className="login"
      >
        <Heading margin="none" level={3} margin="small">
          Login
        </Heading>
        {emailLogin ? (
          <Form
            onSubmit={({ value }) => {
              applyEmail(value);
            }}
          >
            <FormField name="email" htmlfor="textinput-id" label="Email">
              <TextInput id="textinput-id" name="email" required />
            </FormField>
            <FormField name="password" htmlfor="textinput-id" label="Password">
              <TextInput id="textinput-id" name="password" required />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        ) : (
          <>
            <Box width={{ min: "250px" }} margin="small">
              <Button
                fill
                label="Login with Google"
                onClick={() => {
                  applyGoogleAuthentication();
                }}
                icon={<Google color="plain" size="medium" />}
              />
            </Box>
            <Box width={{ min: "250px" }}>
              <Button
                fill
                gap="13px"
                label="Login with Email"
                onClick={({ value }) => {
                  setEmailLogin(true);
                }}
                icon={<Mail color="plain" size="medium" />}
              />
            </Box>
          </>
        )}
        <Box height={{ min: "100px" }} pad="medium">
          {data && (
            <AnnounceContext.Consumer>
              {(announce) => (
                <Announcer
                  announce={announce}
                  message={message}
                  mode="polite"
                  role="alert"
                />
              )}
            </AnnounceContext.Consumer>
          )}
        </Box>
      </Box>
    </Grommet>
  );
}

export default Login;
