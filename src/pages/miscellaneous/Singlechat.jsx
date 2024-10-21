import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { chatState } from "../../Context/ChatProvider";
import {
  Box,
  Text,
  IconButton,
  useToast,
  Spinner,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "./config/Chatlogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import { fetchMessageApi, sendMessageAPI } from "../../api/Authapi";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../Animations/Animation - 1729181695694.json";
const ENDPOINT = "http://localhost:5000/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [socketConnected, setsocketConnected] = useState(false);
  const [Typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState([]);
  const [NewMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Managing loading state
  const { selectedChat, setSelectedChat } = chatState();
  const toast = useToast();
  const token = useSelector((state) => state.tokenReducer);
  const { user, Notification, setNotification } = chatState();

  // animation object of lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const FetchMessage = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true); // Start loading when fetching messages
      const { data } = await fetchMessageApi(token, selectedChat._id);

      setMessage(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to load messages.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading after fetching messages
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => setsocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }
  }, [user]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && NewMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const { data } = await sendMessageAPI(token, {
          content: NewMessage,
          chatId: selectedChat._id,
        });

        socket.emit("new message", data);
        setMessage([...message, data]);
        setNewMessage(""); // Clear message input after successful send

        toast({
          title: "Message sent.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed to send message.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  let typingTimeout;
  const TypingHandler = (e) => {
    const messageValue = e.target.value;
    setNewMessage(messageValue);
    if (!socketConnected) {
      return;
    }

    if (!messageValue) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      if (typingTimeout) clearTimeout(typingTimeout); // Clear timeout if any
      return;
    }

    if (!Typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    const timelength = 3000;
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      var currTime = new Date().getTime();
      var timeDifference = lastTypingTime - currTime;
      if (timeDifference >= timelength && Typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timelength);
  };

  useEffect(() => {
    FetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification

        if (!Notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...Notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "15px", md: "20px" }}
            w="100%"
            px={{ base: 1, md: 2 }} // Responsive padding
            pb={{ base: 1, md: 2 }}
            fontFamily="Work Sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
              aria-label="Back"
            />
            {!selectedChat.isGroupChat ? (
              <Box display="flex" alignItems="center" >
                <Text fontSize={{ base: "sm", md: "lg" }}>
                  {getSender(user, selectedChat.users)}
                </Text>
                <IconButton
                  icon={isModalOpen ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  aria-label="View Profile"
                  ml={2}
                />
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </Box>
            ) : (
              <>
                <Text fontSize={{ base: "sm", md: "lg" }}>
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  FetchMessage={FetchMessage}
                />
              </>
            )}
          </Box>
          <Box
            display="flex"
            p={3}
            flexDirection="column"
            justifyContent="flex-end"
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            maxHeight={{ base: "70vh", md: "80vh" }} // Responsive height
          >
            {loading ? (
              <Spinner size="lg" alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat message={message} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} mt={4}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={50}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="e0e0e0"
                placeholder="Enter a message..."
                onChange={TypingHandler}
                value={NewMessage}
                fontSize={{ base: "sm", md: "md" }} // Responsive font size
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Text fontSize={{ base: "md", md: "lg" }}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
