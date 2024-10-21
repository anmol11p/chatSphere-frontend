import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { chatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";
import UserBadgeItem from "./UserBadgeItem";
import {
  addToGroup,
  deleteFromGroup,
  renameGroup,
  searchUser,
} from "../../api/Authapi";
import UserList from "./UserList";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, FetchMessage }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [Search, setSearch] = useState("");
  const [SearchResult, setSearchResult] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [RenameLoading, setRenameLoading] = useState(false);
  const token = useSelector((state) => state.tokenReducer);
  const { selectedChat, setSelectedChat, user } = chatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter a chat name to update!",
        position: "top-right",
        status: "error",
        isClosable: true,
        duration: 3000,
      });
      return;
    } else {
      try {
        setRenameLoading(true);
        const { data } = await renameGroup(token, {
          chatId: selectedChat._id,
          chatName: groupChatName,
        });

        toast({
          title: "Chat name updated successfully!",
          position: "top-right",
          status: "success",
          isClosable: true,
          duration: 5000,
        });

        setSelectedChat((prev) => ({
          ...prev,
          chatName: data.chatName,
        }));

        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
        setGroupChatName("");
      } catch (error) {
        toast({
          title: "Error occurred",
          description: error.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      }
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: `Only the admin can remove users.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const { data } = await deleteFromGroup(token, {
        chatId: selectedChat._id,
        userId: user1._id,
      });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      FetchMessage(); //refresh the messages
      toast({
        title: `User removed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to remove user!",
        description: error.response?.data?.message || "Failed to remove user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      toast({
        title: "Please enter a name to search.",
        position: "top-right",
        status: "warning",
        isClosable: true,
        duration: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await searchUser(token, Search);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Search failed",
        description: error.response?.data?.message || "Failed to search users.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  const handleAdd = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User is already in the group.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      return;
    } else {
      try {
        const { data } = await addToGroup(token, {
          chatId: selectedChat._id,
          userId: user1._id,
        });
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Failed to add user!",
          description: error.response?.data?.message || "Failed to add user.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <IconButton
        icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
        aria-label="View Profile"
        ml={2}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "xs", md: "lg" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={{ base: "md", md: "lg" }}>
            {selectedChat?.chatName?.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              width="100%"
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              mb={{ base: "1rem", md: "2rem" }}
            >
              {selectedChat?.users?.map((elem) => (
                <UserBadgeItem
                  key={elem._id}
                  user={elem}
                  handleFunction={() => handleRemove(elem)}
                />
              ))}
            </Box>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems="center"
              gap="1rem"
              mb="1rem"
            >
              <FormControl>
                <Input
                  placeholder="Chat name"
                  borderWidth="1px"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  size={{ base: "sm", md: "md" }}
                />
              </FormControl>
              <Button
                bg="purple.200"
                _hover={{
                  bg: "purple.700",
                  color: "gray.100",
                }}
                onClick={handleRename}
                isLoading={RenameLoading}
                size={{ base: "sm", md: "md" }}
              >
                Update
              </Button>
            </Box>
            <FormControl>
              <Input
                placeholder="Add user to group"
                size={{ base: "sm", md: "md" }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
              display="flex"
              flexDirection="column"
              gap="1rem"
              my="10"
              maxHeight="200px"
              overflowY="auto"
            >
              {Loading ? (
                <Spinner size="sm" mt={4} />
              ) : (
                SearchResult.map((user) => (
                  <UserList
                    key={user._id}
                    elem={user}
                    handleFunction={() => handleAdd(user)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              bg="red.300"
              _hover={{
                bg: "red.500",
                color: "#e8e8e8",
              }}
              size={{ base: "sm", md: "md" }}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
