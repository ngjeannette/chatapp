import React, { useEffect, useRef } from 'react';
import { Grommet, TextArea, Button, Box, Heading, Text, Avatar } from 'grommet';
import { grommet } from "grommet/themes";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Send } from 'grommet-icons';
import '../App.scss';
import axios from 'axios';

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
function Conversation(props) {
    const [value, setValue] = React.useState("");
    const [chatHistory, setChatHistory] = React.useState([]);
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {messagesEndRef.current.scrollIntoView({ behavior: "auto" })};
    useEffect(() => {console.log(props.updateUserInfo, 'updateuserinfo') }, [props.updateUserInfo])
    useEffect(() => { console.log(props.selecteduser, 'selecteduser') }, [props.selecteduser])
    useEffect(() => { if (props.updateUserInfo !== '') scrollToBottom() }, [chatHistory]);

    useEffect(() => { console.log(props.chatHistory,'chathistory');setChatHistory(props.chatHistory) },[props.chatHistory])
    
    useEffect(() => { 
    }, [])

    const addConvo = () => {
        // add to axios to update the back end 
        let addConvoObject = 
            {
                to: props.selecteduser,
                from: props.updateUserInfo,
                read: false,
                chatHistory: value
            }
        console.log(addConvoObject,'addConvoObject')
        axios.post('http://localhost:5000/conversation/addconversation', addConvoObject )
            .then(res => console.log('res.data'))
            .catch(error => console.log(error,'error'))  ;
        
        // add to setChatHistory to update the front end
        setChatHistory([...chatHistory, addConvoObject])
    }

    const keypress = (e) => {
        if (e.which == 13 && !e.shiftKey) {
            addConvo();
            setValue("");
        }
    }

    return (
        <Grommet theme={grommet} >
            <Box direction="column" full margin="medium" className="conversation" overflow="hidden" >
                <Box width="100%" className="conversation-header">
                    <Heading margin="none" level={3}>Conversation with: {props.selecteduser}</Heading>
                </Box>
                {/* conversations left and right */}
                { props.updateUserInfo !== '' ?
                    <>
                        <Box height={{ min: "calc(100vh - 219px)", max: "calc(100vh - 219px)" }} overflow="scroll">
                            {
                                // if username isn't the same then left + text
                                chatHistory.map((item, i) => (
                                    <Box key={i} height={{ min: "50px" }}>
                                        {
                                            item.from === props.updateUserInfo ?
                                                // rightside
                                                <Box direction="row" justify="end">
                                                    <Text alignSelf="center" margin="small" >{item.chatHistory}</Text>
                                                    <Avatar background="brand"  >{item.from.slice(0, 1)}</Avatar>
                                                </Box>
                                                :
                                                // left side
                                                <Box direction="row">
                                                    <Avatar background="brand" >{item.from.slice(0, 1)}</Avatar>
                                                    <Text alignSelf="center" margin="small" >{item.chatHistory}</Text>
                                                </Box>
                                        }
                                    </Box>
                                ))

                            }
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box direction="row" >
                            <TextArea
                                placeholder="type here"
                                value={value}
                                onChange={event => setValue(event.target.value)}
                                resize={false}
                                onKeyPress={keypress}

                            />
                            <Box pad="small" alignSelf="center"
                                justify="center">
                                <Button
                                    type="submit"
                                    gap="medium"
                                    plain
                                    onClick={addConvo}
                                    plain icon={<Send />} 
                                />
                            </Box>
                        </Box>
                    </> : 
                    <Box height={{ min: "calc(100vh - 238px)", max: "calc(100vh - 250px)" }} justify="center" width="100%" align="center" >
                        <Heading margin="none" level={3} >Looks like you're not logged in</Heading>
                        <Link to="/login">Log In</Link>
                    </Box>
                }
            </Box>   
        </Grommet>
    );
}

export default Conversation;


