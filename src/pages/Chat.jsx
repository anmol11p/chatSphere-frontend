import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, useToast } from "@chakra-ui/react";
import SideDrawer from "./miscellaneous/SideDrawer";
import MyChats from "./miscellaneous/MyChats";
import Chatbox from "./miscellaneous/Chatbox";

const Chat = () => {
  const token = useSelector((state) => state.tokenReducer);
  const navigate = useNavigate();
  const toast = useToast();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login or sign up first to access the chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      navigate("/login");
    }
  }, [token, navigate, toast]);

  return (
    <>
      <div style={{ width: "100%" }}>
        {token && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh">
          {token && <MyChats fetchAgain={fetchAgain} />}
          {token && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default Chat;
