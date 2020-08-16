import React, { useEffect, useRef } from "react";
import { Grommet, TextArea, Button, Box, Heading, Text, Avatar } from "grommet";
import { grommet } from "grommet/themes";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Send } from "grommet-icons";
import "../App.scss";
import axios from "axios";

// Add the Firebase products that you want to use
function Conversation(props) {
  const [value, setValue] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (props.updateUserInfo !== "") scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    setChatHistory(props.chatHistory);
  }, [props.chatHistory]);

  const addConvo = () => {
    // add to axios to update the back end
    let addConvoObject = {
      to: props.selecteduser,
      from: props.updateUserInfo,
      read: false,
      chatHistory: value,
    };
    //check if it's a new user
    axios
      .post("/conversation/addconversation", addConvoObject)
      .then((res) => {
        if (props.updateUserInfo !== "" && !res.chatHistory) {
          props.callSidebar("rerenderSidebar");
        }
      })
      .catch((error) => console.log(error, "error"));

    // // after axios to update the conversation, rerender the sidebar
    // if (props.updateUserInfo !== "" && chatHistory.length === 0) {
    // }
    // add to setChatHistory to update the front end
    setChatHistory([...chatHistory, addConvoObject]);
  };

  const keypress = (e) => {
    if (e.which == 13 && !e.shiftKey) {
      addConvo();
      setValue("");
    }
  };

  return (
    <Grommet theme={grommet}>
      <Box
        direction="column"
        full
        margin="medium"
        className="conversation"
        overflow="hidden"
        style={{ marginRight: "0 !importnat" }}
      >
        <Box width="100%" className="conversation-header">
          <Heading margin="none" level={3}>
            Conversation with: {props.selecteduser}
          </Heading>
        </Box>
        {/* conversations left and right */}
        {props.updateUserInfo !== "" ? (
          <>
            <Box
              height={{
                min: "calc(100vh - 219px)",
                max: "calc(100vh - 219px)",
              }}
              overflow="scroll"
              style={{
                overflowY: "scroll",
                overflowX: "hidden",
                paddingRight: "5px",
              }}
            >
              {
                // if username isn't the same then left + text
                chatHistory.map((item, i) => (
                  <Box
                    key={i}
                    height={{ min: "auto" }}
                    style={{ margin: "1px 0" }}
                  >
                    {item.from === props.updateUserInfo ? (
                      // rightside
                      <Box direction="row" justify="end">
                        <Text alignSelf="center" margin="small">
                          {item.chatHistory}
                        </Text>
                        <Avatar background="accent-4" className="avatar-convo">
                          {item.from.slice(0, 1).toUpperCase()}
                        </Avatar>
                      </Box>
                    ) : (
                      // left side
                      <Box direction="row">
                        <Avatar background="brand" className="avatar-convo">
                          {item.from.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Text alignSelf="center" margin="small">
                          {item.chatHistory}
                        </Text>
                      </Box>
                    )}
                  </Box>
                ))
              }
              <div ref={messagesEndRef} />
            </Box>
            <Box direction="row">
              <TextArea
                placeholder="type here"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                resize={false}
                onKeyPress={keypress}
              />
              <Box pad="small" alignSelf="center" justify="center">
                <Button
                  type="submit"
                  gap="medium"
                  plain
                  onClick={() => {
                    addConvo();
                    setValue("");
                  }}
                  plain
                  icon={<Send />}
                />
              </Box>
            </Box>
          </>
        ) : (
          <Box
            height={{ min: "calc(100vh - 238px)", max: "calc(100vh - 250px)" }}
            justify="center"
            width="100%"
            align="center"
          >
            <Heading margin="none" level={3}>
              Looks like you're not logged in
            </Heading>
            <Link to="/login">Log In</Link>
          </Box>
        )}
      </Box>
    </Grommet>
  );
}

export default Conversation;
