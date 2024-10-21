import React from "react";
import { Flex, Text, VStack, Avatar } from "@chakra-ui/react";
const UserList = ({ elem, handleFunction }) => {
  return (
    <Flex
      as="li"
      align="center"
      py={2}
      pl={1}
      borderWidth={1}
      borderRadius="md"
      boxShadow="sm"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={() => handleFunction()}
    >
      <Avatar
        name={elem?.username}
        src={
          elem?.pic ||
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
        size="lg"
        mr={4}
      />
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold" isTruncated maxW="200px">
          {elem?.username}
        </Text>
        <Text color="gray.500" isTruncated maxW="200px" fontSize={"12px"}>
          {elem?.email}
        </Text>
      </VStack>
    </Flex>
  );
};

export default UserList;
