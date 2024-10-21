import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  Flex,
  List,
  Skeleton,
  useToast,
  Box,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { accessChat, searchUser } from "../../api/Authapi";
import UserList from "./UserList";
import { chatState } from "../../Context/ChatProvider";

const SearchDrawer = ({ isOpen, onClose }) => {
  const { setSelectedChat } = chatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.tokenReducer);
  const toast = useToast();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const handleUserClick = useCallback(
    async (id) => {
      try {
        const response = await accessChat(token, id);
        // console.log(response);
        if (response.status === 200) {
          setSelectedChat(response.data);
        }
      } catch (error) {
        toast({
          title: "Error accessing chat",
          status: "error",
          position: "top-left",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [token, setSelectedChat, toast]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearch) {
        setSearchResult([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchUser(token, debouncedSearch);

        if (res.status === 200) {
          setSearchResult(res.data);
        } else {
          toast({
            title: `${res.response.data.message} with ${search}`,
            status: "error",
            position: "top-left",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "An error occurred. Try again later.",
          status: "error",
          position: "bottom-left",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearch) {
      performSearch();
    }
  }, [debouncedSearch, token, toast]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleClose = () => {
    setSearch("");
    setSearchResult([]);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontSize={"15px"} color={"purple.700"}>
          Search Users
        </DrawerHeader>

        <DrawerBody>
          <FormControl id="search" mb={4}>
            <Flex>
              <Input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Enter a name or email"
                mr={2}
              />
              <Button
                type="submit"
                colorScheme="blue"
                isDisabled={!search}
                onClick={() => setDebouncedSearch(search)}
              >
                Go
              </Button>
            </Flex>
          </FormControl>

          {loading ? (
            <Flex direction="column" mt={4}>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height="60px" mb={3} borderRadius="md" />
              ))}
            </Flex>
          ) : searchResult.length > 0 ? (
            <List spacing={3}>
              {searchResult.map((elem) => (
                <UserList
                  key={elem._id}
                  elem={elem}
                  handleFunction={() => handleUserClick(elem._id)}
                />
              ))}
            </List>
          ) : (
            debouncedSearch &&
            !loading && (
              <Box mt={6} textAlign="center">
                <Text>No users found.</Text>
              </Box>
            )
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
