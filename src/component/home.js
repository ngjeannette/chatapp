import React, { useState, useEffect, useContext, useReducer }  from 'react';
import { Grommet, Heading, Box,  Image } from 'grommet';
import { Link } from "react-router-dom";
import phoneImage from '../image/phone.png';
import '../App.scss';
import Context from '../context';


const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        },
    },
};
const { Provider } = Context;


const Consumer = () => {
    const [text, setText] = useState('');
    const { state, dispatch } = useContext(Context);

    return (
       <>
        {state.name}
       </>

    );
}

// Add the Firebase products that you want to use
function App() {
    return (
        <Grommet theme={theme} >
            <Consumer />
            <Box direction="row" height={{ min: "calc(100vh - 72px)" }} justify="center" align="center" pad="medium" textAlign="center">
                <Box justify="center" direction="column" textAlign="center"  className="createuser" >
                    <Heading margin="none" level={3} >ChatApp, click here to get started</Heading>
                    <Link to="/createuser">Create User</Link>
                </Box>
                <Box height="medium" >
                    <Image
                        fit="contain"
                        src={phoneImage}
                    />
                </Box>

            </Box>
        </Grommet>
    );
}

export default App;