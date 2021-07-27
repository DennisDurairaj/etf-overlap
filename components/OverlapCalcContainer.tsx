import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FileInput from "./FileInput";
import FileUpload from "./FileUpload";
import { DevTool } from "@hookform/devtools";
import { Button, Flex, HStack, Spacer, Tag, VStack } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import OverlapTable from "./OverlapTable";

interface Props {}

type Files = {
  files: FileList;
};

const processCSV = async (data: Files) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data.files)) {
    formData.append(key, value);
    formData.append(key, value.name);
  }
  const response = await fetch("/api/overlap", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  return result;
};

const OverlapCalcContainer = (props: Props) => {
  const [overlaps, setOverlaps] = useState({});
  const { register, handleSubmit, control, watch } = useForm<Files>({
    mode: "onChange",
  });
  const files = register("files");
  const watchFiles = watch("files");

  const buttonRef = useRef<HTMLInputElement | null>(null);

  const onSubmit: SubmitHandler<Files> = async (data) => {
    const response = await processCSV(data);
    setOverlaps(response);
    console.log(response);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      files.onChange(e);
    }
  };

  return (
    <>
      <VStack marginBottom="8" as="form" spacing={8} borderColor="gray.200">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          ref={(e) => {
            files.ref(e);
            buttonRef.current = e;
          }}
          onBlur={files.onBlur}
          name={files.name}
          style={{ display: "none" }}
        />
        <Button
          leftIcon={<FiUpload />}
          onClick={() => buttonRef.current?.click()}
          colorScheme="blue"
        >
          Select files
        </Button>
        <HStack spacing={2}>
          {watchFiles &&
            watchFiles.length > 0 &&
            Array.from(watchFiles).map((file) => {
              return (
                <Tag
                  size="md"
                  key={file.name}
                  variant="solid"
                  colorScheme="cyan"
                >
                  {file.name}
                </Tag>
              );
            })}
        </HStack>
        <Button
          onClick={() => handleSubmit(onSubmit)()}
          colorScheme="green"
          size="sm"
          variant="outline"
        >
          Submit
        </Button>
      </VStack>
      <OverlapTable overlaps={overlaps} />
    </>
  );
};

export default OverlapCalcContainer;
