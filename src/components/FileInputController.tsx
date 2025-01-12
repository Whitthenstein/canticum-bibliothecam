import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TRANSLATIONS } from "@/lib/translations";

interface Props {
  originalFileName: string | null | undefined;
  fieldProps?: Record<string, unknown>;
  fileType: string;
  handleOnChangeFile: (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void
  ) => void;
  onChange: (...event: unknown[]) => void;
}

const FileInputController = ({
  originalFileName,
  fieldProps,
  fileType,
  handleOnChangeFile,
  onChange
}: Props) => {
  const [willAddNewFile, setWillAddNewFile] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // (originalFileName && !newFile) ||

  useEffect(() => {
    if (willAddNewFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [willAddNewFile, fileInputRef.current]);

  return !newFile && !willAddNewFile && originalFileName ? (
    <div className="items-left flex flex-col">
      {originalFileName}
      <Button
        type="button"
        className="w-[50%]"
        variant={"secondary"}
        onClick={() => {
          setWillAddNewFile(true);
        }}
      >
        {TRANSLATIONS.pt.addNew}
      </Button>
    </div>
  ) : (
    <Input
      {...fieldProps}
      ref={fileInputRef}
      type="file"
      accept={fileType}
      onChange={(event) => {
        if (event.target.files && event.target.files[0]) {
          setNewFile(event.target.files[0]);
          handleOnChangeFile(event, onChange);

          setWillAddNewFile(false);
        }
      }}
    />
  );
};

export default FileInputController;
