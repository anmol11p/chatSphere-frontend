import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react"; // Using Chakra UI's useToast
import { loginUserDetails } from "../api/Authapi";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [Notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.tokenReducer);
  const toast = useToast();

  const loginUser = async () => {
    if (!token) return;

    try {
      const response = await loginUserDetails(token);    
      if (response.status === 200) {
        setUser(response.data.message); // Make sure the response is as expected
      }
    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Error",
        description: "Failed to load user details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loginUser();
  }, [token]);

  return (
    <chatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        user,
        Notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const chatState = () => {
  return useContext(chatContext);
};

export default ChatProvider;
