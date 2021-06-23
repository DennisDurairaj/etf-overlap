import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface Props {
  register: UseFormRegister<FieldValues>;
  fileName: string;
  providerName: string;
}

const FileInput = ({ register, fileName, providerName }: Props) => {
  return (
    <>
      <select {...register(providerName)}>
        <option>IShares</option>
        <option>Amundi</option>
      </select>
      <input {...register(fileName)} type="file" />
      {/* <input type="submit" /> */}
    </>
  );
};

export default FileInput;
