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
import { useTable } from "react-table";

interface Props {
  overlaps: {
    [key: string]: {
      Name: string;
      Weight: number;
    }[];
  };
}

const OverlapTable = ({ overlaps }: Props) => {
  return (
    <VStack spacing={10} align="stretch">
      {Object.keys(overlaps).map((key) => {
        if (overlaps[key].length > 0) {
          return (
            <Box key={key} borderWidth="1px" borderRadius="lg">
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
                      <Tr key={item.Name}>
                        <Td>{item.Name}</Td>
                        <Td isNumeric>{item.Weight}%</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          );
        }
      })}
    </VStack>
  );
};

export default OverlapTable;
