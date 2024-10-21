import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Spinner,
  Box,
  Text,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { chatState } from "../../Context/ChatProvider";
import { createGroup, searchUser } from "../../api/Authapi";
import UserBadgeItem from "./UserBadgeItem";
import UserList from "./UserList";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState(""); // Correct way to declare state

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const token = useSelector((state) => state.tokenReducer);
  const { chats, setChats } = chatState();

  // Handle user search
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) return;

    try {
      setLoading(true);
      const { data } = await searchUser(token, value);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load search results.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: "5000",
        isClosable: "true",
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  // Handle group chat creation
  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (selectedUsers.length<2) {
        toast({
          title: "Atleast three users in a Group!",
          isClosable: true,
          duration: 2000,
          status: "error",
        });
        return 
    }
    try {
      const response = await createGroup(
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        token
      );

      setChats([response.data, ...chats]);
      onClose();
      toast({
        title: "New Group chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // if (response.status === 400) {
      //   toast({
      //     title: response.data.message,
      //     isClosable: true,
      //     duration: 2000,
      //     status: "error",
      //   });
      // }
    } catch (error) {
      toast({
        title: "Failed to Create the chat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setGroupChatName("");
    onClose();
  };

  const handleDelete = (deleteUser) => {
    const filterUser = selectedUsers.filter((currElem) => {
      return currElem._id !== deleteUser._id;
    });
    setSelectedUsers(filterUser);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent={"center"}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir={"column"} alignItems={"center"}>
            {/* Group Chat Name Input */}
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            {/* Search Users */}
            <FormControl>
              <Input
                type="text"
                placeholder="Add users (e.g., John Doe, Piyush, Anmol)"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} w={"100%"} flexWrap={"wrap"} gap={"5px"}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                ></UserBadgeItem>
              ))}
            </Box>
            {loading ? <Spinner size="lg" /> : null}

            <Box
              my={3}
              display={"flex"}
              flexDir={"column"}
              gap={"10px"}
              width={"100%"}
            >
              {searchResult &&
                searchResult.map((user) => (
                  <UserList
                    elem={user}
                    handleFunction={() => handleSelectUser(user)}
                  />
                ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
