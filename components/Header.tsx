import { Flex, Heading, Spacer, Container } from "@chakra-ui/react";
import React from "react";

interface Props {}

const Header = (props: Props) => {
  return (
    <Flex
      style={{ boxShadow: "1px 2px 18px rgb(0 0 0 / 10%)" }}
      as="nav"
      padding={4}
      {...props}
      color="cyan.600"
    >
      <Container maxW="container.xl">
        <Flex alignItems="center">
          <Heading
            as="h1"
            fontSize={["xl", "2xl", "3xl"]}
            letterSpacing="tight"
          >
            ETF Overlap
          </Heading>
          <Spacer />
          <div>Theme</div>
        </Flex>
      </Container>
    </Flex>
  );
};

export default Header;
