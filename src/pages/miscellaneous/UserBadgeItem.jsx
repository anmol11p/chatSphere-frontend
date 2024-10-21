import React from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display={"flex"}
      alignItems="center"
      bg="purple"
      color="white"
      borderRadius="md"
      px={3}
      py={2}
      my={2}
      mx={1}
    >
      <Text fontSize="sm" mr={2}>
        {user.username}
      </Text>
      <CloseIcon
        pl={1}
        cursor={"pointer"}
        size="sm"
        icon={<CloseIcon />}
        onClick={() => handleFunction()}
        colorScheme="red"
        borderRadius="full"
        aria-label="Remove user"
      />
    </Box>
  );
};

export default UserBadgeItem;
