import React from "react";
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
import { Google, Mail } from "grommet-icons";
import firebase from "../firebase.js";
import axios from "axios";
import "../App.scss";

// Add the Firebase products that you want to use
function App() {
  const [createWithEmail, setCreateWithEmail] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [message, setMessage] = React.useState("");

  const axiosPostCreateUser = (newuser) => {
    return axios.post("/user/createuser", newuser);
  };
  // const axiosPostCreateUser = (newuser) => {
  //     return axios.post('/user/createuser', newuser)
  //         .then(res => { setMessage('User Created')})
  //         .catch(error => {
  //
  //             setMessage('incorrect info')
  //         })
  // }

  const axiosCheckDuplicate = (email, username, newUser) => {
    return axios.get("/user/checkemail", { params: { email, username } });
  };

  const applyGoogleAuthentication = async () => {
    setCreateWithEmail(false);
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    try {
      const authResult = await auth.signInWithPopup(provider);
      const user = authResult.user;
      let newUser = {
        username: user.displayName,
        email: user.email,
        isgoogleauthenticate: true,
      };
      setData(newUser);
      const checkResult = await axiosCheckDuplicate(
        newUser.email,
        newUser.displayName,
        newUser
      );

      if (checkResult.data.length === 0) {
        try {
          const createResult = await axiosPostCreateUser(newUser);
          setMessage("User Created");
        } catch (err) {
          setMessage("incorrect info");
        }
      } else {
        setMessage("Email or Username already used");
      }
    } catch (error) {}
  };

  const applyEmail = async (value) => {
    const newUser = value;
    newUser.isgoogleauthenticate = false;
    try {
      setData(newUser);
      const checkResult = await axiosCheckDuplicate(
        newUser.email,
        newUser.username,
        newUser
      );

      if (checkResult.data.length === 0) {
        try {
          const createResult = await axiosPostCreateUser(newUser);
          setMessage("User Created");
        } catch (err) {
          setMessage("incorrect info");
        }
      } else {
        setMessage("Email or Username already used");
      }
    } catch (error) {}
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
        className="createuser"
      >
        <Heading margin="none" level={3} margin="small">
          Create User
        </Heading>
        {createWithEmail ? (
          <Form
            onSubmit={({ value }) => {
              applyEmail(value);
            }}
          >
            <FormField name="username" htmlfor="textinput-id" label="Username">
              <TextInput id="textinput-id" name="username" required />
            </FormField>
            <FormField name="password" htmlfor="textinput-id" label="Password">
              <TextInput id="textinput-id" name="password" required />
            </FormField>
            <FormField name="email" htmlfor="textinput-id" label="Email">
              <TextInput id="textinput-id" name="email" required />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        ) : (
          <>
            <Box width={{ min: "250px" }} pad="small">
              <Button
                fill
                label="Create with Google"
                onClick={() => {
                  applyGoogleAuthentication();
                }}
                icon={<Google color="plain" size="medium" />}
              />
            </Box>
            <Box width={{ min: "250px" }}>
              <Button
                gap="13px"
                fill
                label="Create with Email"
                onClick={({ value }) => {
                  setCreateWithEmail(true);
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

export default App;
