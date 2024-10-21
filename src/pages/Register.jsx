import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaUser } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setToken } from "../Redux/tokenSlice";
import { uploadImage, userRegister } from "../api/Authapi";
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

const Register = () => {
  const [toggle, setToggle] = useState(false);
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    try {
      const dataToSend = {
        ...data,
        pic: pic,
      };
      const response = await userRegister(dataToSend);
      if (response.status === 201) {
        toast.success(response.data.message);
        dispatch(setToken(response.data.token));
        setData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const uploadPhoto = async (pic) => {
    if (!pic) {
      toast.error("Please select an image");
      return;
    }

    // Check if the file is an image
    if (pic.type.startsWith("image/")) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");

      try {
        const response = await uploadImage(data);
        if (response.status === 200) {
          setPic(response.data.url.toString());
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        toast.error("Error uploading image");
      }
    } else {
      toast.error("Please select a valid image file");
    }
  };

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50" p={[4, 8]}>
      <Box
        p={[6, 8]}
        w="full"
        maxW={["100%", "400px"]}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} as="form" onSubmit={handleFormSubmit}>
          <Heading size="lg" textAlign="center">
            Register
          </Heading>

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={data.username}
              onChange={handleOnChange}
              placeholder="Enter your username"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              placeholder="Enter your email"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone No.</FormLabel>
            <Input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleOnChange}
              placeholder="Enter your phone number"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={toggle ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                autoComplete="off"
                focusBorderColor="teal.500"
              />
              <InputRightElement
                onClick={() => setToggle(!toggle)}
                cursor="pointer"
              >
                {toggle ? <FaEye /> : <IoMdEyeOff />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Upload Photo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => uploadPhoto(e.target.files[0])}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            mt={4}
            isDisabled={loading} // Disable button while loading
          >
            {loading ? <Spinner size="sm" /> : "Submit"}{" "}
            {/* Show spinner when loading */}
          </Button>

          <Button variant="link" colorScheme="teal" as={NavLink} to="/login">
            Log In
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;
