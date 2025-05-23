import React, { useState } from "react";
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
import { FaEye, FaUser } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setToken } from "../Redux/tokenSlice";
import { uploadImage, userRegister } from "../api/Authapi";

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPicUploaded, setIsPicUploaded] = useState(false);
  const [picUrl, setPicUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return toast.error("Please select an image");

    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "chat-app");

    try {
      const response = await uploadImage(formData);
      if (response.status === 200) {
        setPicUrl(response.data.url);
        setIsPicUploaded(true);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPicUploaded) {
      return toast.error("Please upload your photo");
    }

    setIsSubmitting(true);

    try {
      const payload = { ...data, pic: picUrl };
      const res = await userRegister(payload);

      if (res.status === 201) {
        dispatch(setToken(res.data.token));
        toast.success(res.data.message);
        navigate("/");

        setData({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setPicUrl(null);
        setIsPicUploaded(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50" p={6}>
      <Box
        p={8}
        w="full"
        maxW="400px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <VStack as="form" spacing={4} onSubmit={handleSubmit}>
          <Heading size="lg" textAlign="center">
            Register
          </Heading>

          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              value={data.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              autoComplete="off"
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="off"
                focusBorderColor="teal.500"
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <IoMdEyeOff />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Upload Photo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" /> : "Register"}
          </Button>

          <Button as={NavLink} to="/login" variant="link" colorScheme="teal">
            Already have an account? Log In
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Register;
