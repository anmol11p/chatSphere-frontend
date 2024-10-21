import React from "react";
import { chatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Singlechat from "./Singlechat";

const Chatbox = ({ fetchAgain, setFetchAgain  }) => {
  const { selectedChat } = chatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius={"md"}
      borderWidth={"1px"}
    
    >
      <Singlechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
