import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {getTranslations} from 'next-intl/server';

import { Input } from "./ui/input";
import { Button } from "./ui/button";

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

const FileInputController = async ({
  originalFileName,
  fieldProps,
  fileType,
  handleOnChangeFile,
  onChange
}: Props) => {
  const t = await getTranslations();
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
        {t("addNew")}
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
