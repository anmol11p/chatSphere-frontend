import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setToken } from "../Redux/tokenSlice";
import { userLogin } from "../api/Authapi";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Spinner,
} from "@chakra-ui/react";

const Login = () => {
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const res = await userLogin(data);
      setData({ email: "", password: "" });
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(setToken(res.data.token));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.50" px={4}>
      <Box
        p={8}
        width={{ base: "100%", sm: "400px", md: "450px" }} // Responsive width for mobile, tablet, and desktop
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={6} as="form" onSubmit={handleFormSubmit}>
          <Heading size="lg" textAlign="center" fontSize="2xl">
            Login
          </Heading>

          <FormControl isRequired>
            <FormLabel fontSize="lg">Email</FormLabel> {/* Larger font size */}
            <Input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              placeholder="Enter your email"
              autoComplete="off"
              focusBorderColor="teal.500"
              fontSize="md"
              p={3}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="lg">Password</FormLabel>
            <InputGroup>
              <Input
                type={toggle ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                autoComplete="off"
                focusBorderColor="teal.500"
                fontSize="md"
                p={3}
              />
              <InputRightElement
                onClick={() => setToggle(!toggle)}
                cursor="pointer"
                fontSize="lg"
              >
                {toggle ? <FaEye /> : <IoMdEyeOff />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            mt={6}
            p={6}
            isDisabled={loading} // Disable the button while loading
          >
            {loading ? <Spinner size="md" /> : "Submit"}{" "}
            {/* Show spinner if loading */}
          </Button>

          <Button
            variant="link"
            colorScheme="teal"
            as={NavLink}
            to="/register"
            fontSize="lg"
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
