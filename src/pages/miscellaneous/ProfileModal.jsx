import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "xs", sm: "md", md: "lg" }} // Smaller modal for base screens
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          textAlign="center"
          fontSize={{ base: "md", sm: "lg", md: "xl" }} // Smaller font size on 320px screens
        >
          My Profile
        </ModalHeader>

        <ModalBody mt={"1.5rem"}>
          {" "}
          {/* Reduced margin on smaller screens */}
          <Flex
            align="center"
            direction={{ base: "column", md: "row" }} // Stack on small screens, row on larger
            gap={{ base: "1rem", md: "3rem" }}
            justify="center"
            px={{ base: "1rem", md: "2rem" }} // Add padding to fit smaller screens
          >
            {user?.pic && (
              <Image
                src={user.pic}
                alt={user.username}
                boxSize={{ base: "60px", sm: "80px", md: "100px" }} // Smaller image for base screens
                borderRadius="full"
                mb={{ base: 4, md: 0 }}
              />
            )}
            <Box textAlign={{ base: "center", md: "left" }}>
              {/* Centered text on small screens */}
              <Text
                fontWeight="bold"
                fontSize={{ base: "md", sm: "lg", md: "xl" }}
              >
                {user?.username}
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm", md: "md" }}>
                {user?.email}
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm", md: "md" }}>
                {user?.phone}
              </Text>
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            width={{ base: "100%", md: "auto" }} // Full width button on small screens
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
