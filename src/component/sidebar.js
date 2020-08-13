import React, {useState, useEffect} from 'react';
import { Grommet, Sidebar, Box, Nav, Button, TextInput, Text} from 'grommet';
import { grommet } from "grommet/themes";
import { AddCircle } from 'grommet-icons';
import Conversation from './conversation';
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
function Chat(props) {
    const [allusers, setAllUsers] = useState([])
    const [conversationHome, setConversationHome] = useState(false);
    const [suggestions, setSuggestion] = useState([]);
    const [sidebaruser, setsidebaruser] = useState([]);
    const [selecteduser, setSelectedUser] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [value, setValue] = React.useState("");
    const [sidebarcount, setSideBarCount] = React.useState([]);


    useEffect(()=> {
    // axios get for all the usernames on the databse -> set onto a list for the suggestions
    axiosGetAllUsers();
    if(props.updateUserInfo !== "") axiosGetSideBarConvo();
    }, []);

    const axiosGetAllUsers = () => {
        axios.get('http://localhost:5000/user/allusers/', {params: {username: props.updateUserInfo}})
        .then(res => {
            setAllUsers(res.data);
            let allusers = res.data.map(item => (
                item.username
            ))
            setSuggestion(allusers)
        })
        .catch(error => console.log(error, 'axioserrors'))
    }

    useEffect(()=>{},[conversationHome])
    useEffect(()=>{},[sidebaruser])
    useEffect(() => {}, [selecteduser])

    // const suggestions = Array(100)
    //     .fill()
    //     .map((_, i) => `suggestion ${i + 1}`);


    const onChange = event => {setValue(event.target.value);}

    const onSelect = event =>  {
        setValue(event.suggestion);
        setSelectedUser(event.suggestion)
        setConversationHome(true);
        axiosFindConversation(event.suggestion);
        setValue('')
    }

    const axiosFindConversation = (username) => {
        const passParams = {
            to: username,
            from: props.updateUserInfo
        }
        axios.get('http://localhost:5000/conversation/selectedconvo', { params: passParams })
            .then(res => { setChatHistory(res.data) })
            .catch(error => {
                console.log(error, 'not able to create user ');
            })
    };

    const axiosGetSideBarConvo = () => {
        const user = { user: props.updateUserInfo };
        axios.get('http://localhost:5000/conversation/friends', { params: user })
            .then(res => { 
                setsidebaruser(res.data);
            })
            .catch(error => { console.log(error, 'error') });
    };

    const axiosUpdateRemoveUnread = (username) => {
        const passParams = {
            to: username,
            from: props.updateUserInfo
        };
        axios.post('http://localhost:5000/conversation/updateunread', passParams)
            .then(res => {console.log(res.data,'resdatupdateread')})
            .catch(error => console.log(error,'errroraxios'))
    }

    return (
        <Grommet theme={grommet} >
            <Box direction="row" height={{ min: "calc(100vh - 72px)" }}>
                <Sidebar
                    responsive={false}
                    background="brand"
                    pad={{ left: "medium", right: "large", vertical: "medium" }}
                >
                    <Nav gap="large" responsive={false} >
                        <Box pad="small">
                            <Button
                                gap="medium"
                                alignSelf="start"
                                plain
                                label='Add convo'
                                reverse
                                icon={<AddCircle />}
                                onClick={() => { setConversationHome(false)}}
                            />
                           {
                               sidebaruser.length > 0 &&
                                sidebaruser.map((item,index) => (
                                    <Box direction="row" justify="between" >
                                        <Button
                                            gap="medium"
                                            alignSelf="start"
                                            plain
                                            label={item.friend}
                                            reverse
                                            fill
                                            onClick={({value}) => { 
                                                setSelectedUser(item.friend)
                                                setConversationHome(true); 
                                                axiosFindConversation(item.friend);
                                                }}
                                        />
                                        
                                    { Number(item.unread) > 0 && 
                                        <Button
                                            gap="medium"
                                            alignSelf="start"
                                            plain
                                            label={item.unread}
                                            reverse
                                            pad='small'
                                            onClick={({ value }) => {
                                                setSelectedUser(item.friend)
                                                setConversationHome(true);
                                                axiosFindConversation(item.friend);
                                                // remove the number 
                                                sidebaruser[index].unread = 0;
                                                axiosUpdateRemoveUnread(item.friend);
                                                // update the axios call 
                                            }}
                                        />}
                                    </Box>
                               ))
                           }
                
                        </Box>
                    </Nav>
                </Sidebar>
                <Box full width={{ min: "calc(100% - 230px)" }}>
                    {
                        conversationHome > 0 ? 
                            <Conversation selecteduser={selecteduser} updateUserInfo={props.updateUserInfo} chatHistory={chatHistory} />
                        :
                        <Box width={{ min: "100%" }} pad="large">
                            <Text>Start a conversation here, select a person 💬 </Text>
                            <TextInput
                                value={value}
                                onChange={onChange}
                                onSelect={onSelect}
                                suggestions={suggestions}
                            />
                        </Box>
                    }
                </Box>
               
            </Box>
        </Grommet>
    );
}

export default Chat;
