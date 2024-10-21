import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
} from "./config/Chatlogic";
import { chatState } from "../../Context/ChatProvider";
import { Avatar, Box, Text, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ message }) => {
  const { user } = chatState();

  if (!message || message.length === 0) {
    return <Text color={"red.500"}>No messages to display</Text>;
  }

  return (
    <ScrollableFeed className="overflow-stop">
      {message.map((msg, index) => (
        <div
          key={msg._id}
          style={{
            padding: "5px",
            margin: "5px 0",
            borderRadius: "5px",
          }}
        >
          <Box display={"flex"}>
            {(isSameSender(message, msg, index, user._id) ||
              isLastMessage(message, index, user._id)) && (
              <Tooltip
                label={msg.sender.username}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size={"sm"}
                  cursor={"pointer"}
                  src={msg.sender.pic}
                  name={msg.sender.username}
                />
              </Tooltip>
            )}

            <Text
              bg={msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}
              borderRadius={"0.8rem"}
              padding={"10px 20px"}
              maxWidth={"75%"}
              marginLeft={isSameSenderMargin(message, msg, index, user._id)}
            >
              {msg.content}
            </Text>
          </Box>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
