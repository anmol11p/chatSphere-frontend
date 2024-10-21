import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";

import {
  Box,
  Flex,
  Button,
  IconButton,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  WrapItem,
  Avatar,
  useDisclosure,
  useToast,
  MenuItem,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { CiSearch } from "react-icons/ci"; // Retaining CiSearch for the search icon
import { clearToken } from "../../Redux/tokenSlice";
import { useNavigate } from "react-router-dom";
import SearchDrawer from "./Drawer";
import ProfileModal from "./ProfileModal";
import { chatState } from "../../Context/ChatProvider";
import { getSender } from "./config/Chatlogic";

const SideDrawer = () => {
  const [toggle, setToggle] = useState(false); // Toggle for menu visibility
  const {
    isOpen: isModalVisible,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, Notification, setNotification, setSelectedChat } = chatState();

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/");
    toast({
      title: "Logout success.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box w="100%" p={4} alignItems={"center"} justifyContent={"space-between"}>
      <Box
        justify="space-between"
        align="center"
        className={toggle ? "menu-toggle navbar" : "menu-toggle-close navbar"}
      >
        <Flex align="center" className="search-section">
          <Tooltip label="Search users to chat" placement="top">
            <IconButton
              icon={<CiSearch />} // Correct icon for the search button
              aria-label="Search a user"
              onClick={openDrawer}
              variant="outline"
              mr={2}
            />
          </Tooltip>
          <Button
            variant="ghost"
            onClick={openDrawer}
            className="btn-search-user gayab"
          >
            Search a user
          </Button>
        </Flex>

        {/* Centering ChatSphere */}
        <Flex flex="1" justify="center" className="gayab">
          <Text textAlign="center" fontWeight="bold" fontSize="xl">
            ChatSphere
          </Text>
        </Flex>

        <Flex align="center" gap={"1rem"} display={toggle ? "none" : "flex"}>
          {/* Hide menu items when toggle is active */}
          <Menu className="menu">
            <MenuButton as={Button} leftIcon={<BellIcon />} bg="white">
              <Badge colorScheme="red" borderRadius="full" px={2}>
                {Notification.length}
              </Badge>
            </MenuButton>

            <MenuList
              display={"flex"}
              cursor={"pointer"}
              alignItems={"center"}
              flexDir={"column"}
              fontSize={"0.9rem"}
              px={"0.5rem"}
            >
              {!Notification.length
                ? "No messages here"
                : Notification.map((notify) => (
                    <MenuItem
                      key={notify._id}
                      onClick={() => {
                        setSelectedChat(notify.chat);
                        setNotification(
                          Notification.filter((n) => n !== notify)
                        );
                      }}
                    >
                      {notify.chat.isGroupChat
                        ? `${notify.chat.chatName}`
                        : `New message from ${getSender(
                            user,
                            notify.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              bg="white"
              style={{ background: "transparent" }}
            >
              <WrapItem>
                <Avatar name={user?.username} src={user?.pic} />
              </WrapItem>
            </MenuButton>
            <MenuList bg="white" borderRadius="md" padding="10px">
              <Button onClick={openModal} variant="outline" width="100%" mb={2}>
                My Profile
              </Button>
              <Button onClick={handleLogout} colorScheme="red" width="100%">
                Logout
              </Button>
            </MenuList>
          </Menu>
        </Flex>
        <IconButton
          className="three-dot-icons"
          bg={"transparent"}
          px={2}
          icon={<GiHamburgerMenu />}
          onClick={() => setToggle(!toggle)}
          display={{ base: "inline-block", md: "none" }}
          aria-label="Toggle Menu"
        />
      </Box>

      {/* Hamburger Button for Toggling */}

      {/* Drawer for Search */}
      <SearchDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Modal for Profile */}
      <ProfileModal isOpen={isModalVisible} onClose={closeModal} user={user} />
    </Box>
  );
};

export default SideDrawer;
