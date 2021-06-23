import { Container } from "@chakra-ui/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Body = (props: Props) => {
  return <Container maxW="container.xl">{props.children}</Container>;
};

export default Body;
