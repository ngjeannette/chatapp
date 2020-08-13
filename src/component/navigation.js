import React, { useEffect } from 'react';
import { Grommet, Header, Avatar, Box, Anchor } from 'grommet';
import { grommet } from "grommet/themes";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { deepMerge } from "grommet/utils";
import '../App.scss';


const theme = deepMerge(grommet, {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        },
        colors: {
            focus: "neutral-4"
        }
    }
});
// Add the Firebase products that you want to use
function Navigation(props) {
    useEffect(() => {}, [props.avatarmessage])
    return (
        <Grommet theme={grommet} className="navigation">
            <Header background="brand" pad="small" height={{ min: "72px" }} >
                {props.avatarmessage ? <Avatar background="accent-4" >{props.avatarmessage}</Avatar> : <></>}
                <Box direction="row" gap="medium">
                    <Anchor label="Project 6: ChatApp" href="https://flaviocopes.com/sample-app-ideas/" className="link" />
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/createuser">Create User</Link>
                    <Link to="/conversation">Convo</Link>
                    <Link to="/">Logout</Link>
                </Box>
            </Header>
        </Grommet>
    );
}

export default Navigation;
