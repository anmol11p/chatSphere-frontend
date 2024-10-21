import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../Redux/tokenSlice";
import { toast } from "react-toastify";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";

const Header = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.tokenReducer);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/");
    toast.error("Logout successful");
  };

  return (
    <Box as="header" bg="blue.500" color="white" py={4}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading size="lg">ChatSphere</Heading>
        <HStack spacing={4}>
          <NavLink to="/">
            <Button variant="link" colorScheme="whiteAlpha">
              Home
            </Button>
          </NavLink>

          {token ? (
            <Button
              variant="link"
              colorScheme="whiteAlpha"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="link" colorScheme="whiteAlpha">
                  Login
                </Button>
              </NavLink>
              <NavLink to="/register">
                <Button variant="link" colorScheme="whiteAlpha">
                  Signup
                </Button>
              </NavLink>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
