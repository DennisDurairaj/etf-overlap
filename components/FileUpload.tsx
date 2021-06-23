import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Code,
  Icon,
} from "@chakra-ui/react";
// import { FiFile } from "react-icons/fi";
import { useController } from "react-hook-form";
import { useRef } from "react";

interface Props {
  name: string;
  placeholder: string;
  acceptedFileTypes?: any;
  control: any;
  children?: any;
  isRequired?: boolean;
}

const FileUpload = ({
  name,
  placeholder,
  acceptedFileTypes,
  control,
  children,
  isRequired = false,
}: Props) => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const {
    field: { ref, onChange, value, ...inputProps },
    fieldState: { invalid, isTouched, isDirty },
  } = useController({
    name,
    control,
    rules: { required: isRequired },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <FormControl isInvalid={invalid} isRequired>
      <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          // children={<Icon as={FiFile} />}
        />
        <input
          type="file"
          accept={acceptedFileTypes}
          ref={inputRef}
          {...inputProps}
          onChange={handleFileUpload}
          style={{ display: "none" }}
          multiple
        ></input>
        <Input
          placeholder={placeholder || "Your files ..."}
          onClick={() => inputRef.current.click()}
          onChange={() => {}}
          value={value || ""}
        />
      </InputGroup>
      <FormErrorMessage>{invalid}</FormErrorMessage>
    </FormControl>
  );
};

export default FileUpload;
