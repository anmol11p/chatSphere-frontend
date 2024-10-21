import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { chatState } from "../../Context/ChatProvider";
import { fetchChat } from "../../api/Authapi";
import { Box, Button, Stack, Spinner, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "./config/Chatlogic";
import GroupChatModel from "./GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const token = useSelector((state) => state.tokenReducer);
  const { selectedChat, setSelectedChat, chats, setChats } = chatState();

  const FetchChat = async () => {
    if (!token) return;
    try {
      const res = await fetchChat(token);
      if (res.status === 200) {
        setChats(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { user } = chatState();
  // console.log(user);

  useEffect(() => {
    FetchChat();
  }, [token, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      borderRadius={"lg"}
      w={{ base: "100%", md: "31%" }}
      bg={"green.100"}
    >
      <Box
        py={2}
        px={2}
        fontSize={{ base: "20px", md: "20px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModel>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="purple"
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"} className="overflow-stop">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Spinner size="lg" />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
