import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  const isActive = ({ isActive }) => (isActive ? "active" : "");

  return (
    <Box as="footer" bg="blue.500" color="white" py={4} mt={8}>
      <Flex
        maxW="1200px"
        mx="auto"
        px={4}
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        flexDir={{ base: "column", md: "row" }} // Column for mobile, row for larger screens
      >
        {/* Copyright Text */}
        <Text
          fontSize={{ base: "sm", md: "md" }} // Smaller font on mobile
          textAlign="center"
          mb={{ base: 2, md: 0 }} // Bottom margin for mobile
          flexBasis="100%"
        >
          &copy; {new Date().getFullYear()} All rights reserved by @anmolPanday
        </Text>

        {/* Links */}
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }} // Stack links on mobile, row on larger screens
          flexBasis="100%"
          gap={{ base: 1, md: 4 }} // Adjust gap between links
        >
       
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
