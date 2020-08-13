import React, { useEffect } from 'react';
import { Grommet, AnnounceContext, Button, Box, Form, FormField, TextInput, Text, Heading } from 'grommet';
import { grommet } from "grommet/themes";
import { Google, Mail } from 'grommet-icons';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import firebase from '../firebase.js';
import axios from 'axios';
import '../App.scss';

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        },
    },
};

// Add the Firebase products that you want to use
function App() {
    const [createWithEmail, setCreateWithEmail] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [isDuplicate, setIsDuplicate] = React.useState(false);

    useEffect(() => {}, [data])
    // useEffect(() => {}, [isDuplicate])

    const axiosPostCreateUser = (newuser) => {
        return axios.post('http://localhost:5000/user/createuser', newuser)
    }
    // const axiosPostCreateUser = (newuser) => {
    //     return axios.post('http://localhost:5000/user/createuser', newuser)
    //         .then(res => { setMessage('User Created')})
    //         .catch(error => {
    //             console.log(error, 'not able to create user ');
    //             setMessage('incorrect info')
    //         })
    // }

    const axiosCheckDuplicate = (email, username, newUser) => {
        return axios.get('http://localhost:5000/user/checkemail', { params: { email, username } })
    };

    const applyGoogleAuthentication = async () => {
        setCreateWithEmail(false)
        const provider = new firebase.auth.GoogleAuthProvider();
        const auth = firebase.auth();
        try {
            const authResult = await auth.signInWithPopup(provider);
            const user = authResult.user;
            let newUser = {
                username: user.displayName,
                email: user.email,
                isgoogleauthenticate: true
            }
            setData(newUser);
            const checkResult = await axiosCheckDuplicate(newUser.email, newUser.displayName, newUser);
            console.log('checkResult.dat', checkResult.data)
            if (checkResult.data.length === 0) {
                try {
                    const createResult = await axiosPostCreateUser(newUser);
                    setMessage('User Created');
                } catch (err) {
                    console.log(err, 'not able to create user ');
                    setMessage('incorrect info')
                }
                
            } else {
                console.log('email not rcreated')
                setMessage('Email or Username already used');
            }
        }
        catch(error){
           console.log(error,'error')
        }
    };

    const applyEmail = async(value) => {
        const newUser = value;
        newUser.isgoogleauthenticate = false;
        try {
            setData(newUser);
            const checkResult = await axiosCheckDuplicate(newUser.email, newUser.username, newUser)
            console.log('checkResult', checkResult);
            console.log('checkResult.dat', checkResult.data)
            if (checkResult.data.length === 0) {
                try {
                    const createResult = await axiosPostCreateUser(newUser);
                    setMessage('User Created');
                } catch (err) {
                    console.log(err, 'not able to create user ');
                    setMessage('incorrect info')
                }

            } else {
                console.log('email not rcreated')
                setMessage('Email or Username already used');
            }
        }
        catch (error) {
            console.log(error, 'error')
        }
    }

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
        <Grommet theme={grommet} >
            <Box direction="column" height={{ min: "calc(100vh - 72px)" }} justify="center" align="center" className="createuser" >
                <Heading margin="none" level={3} margin="small" >Create User</Heading>
                {
                    createWithEmail ?  
                        <Form onSubmit={({ value }) => { applyEmail(value); }}>
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
                    : 
                    <>
                         <Box width={{ min: "250px" }} pad="small">
                            <Button fill label="Create with Google" onClick={() => { applyGoogleAuthentication() }} icon={<Google color='plain' size='medium' /> } />
                        </Box>
                        <Box width={{ min: "250px" }}  >
                             <Button gap="13px" fill  label="Create with Email"  onClick={({ value }) => { setCreateWithEmail(true) }} icon={<Mail color='plain' size='medium' />}  />
                        </Box>
                    </>
                }
                <Box height={{ min: "100px" }} pad="medium">
                    {
                        data && 
                            <AnnounceContext.Consumer>
                                {announce => <Announcer announce={announce} 
                                    message={message}
                                    mode="polite"
                                    role="alert"
                                />}
                            </AnnounceContext.Consumer>
                    }
                </Box>
            </Box>
        </Grommet>
    );
}

export default App;


