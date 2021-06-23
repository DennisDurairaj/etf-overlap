import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Box,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  overlaps: {
    [key: string]: {
      name: string;
      overlap: number;
    }[];
  };
}

const OverlapTable = ({ overlaps }: Props) => {
  return (
    <VStack spacing={10} align="stretch">
      {Object.keys(overlaps).map((key) => {
        if (overlaps[key].length > 0) {
          return (
            <Box borderWidth="1px" borderRadius="lg">
              <Table size="sm" variant="striped">
                <TableCaption placement="top">{key}</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th isNumeric>Overlap(%)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {overlaps[key].map((item) => {
                    return (
                      <Tr>
                        <Td>{item.name}</Td>
                        <Td isNumeric>{item.overlap}%</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          );
        }
      })}
      {/* <Table p="6" variant="striped">
        <TableCaption placement="top">
          Imperial to metric conversion factors
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody>
      </Table> */}
    </VStack>
  );
};

export default OverlapTable;
