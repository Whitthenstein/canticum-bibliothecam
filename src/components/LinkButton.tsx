import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  text?: string;
  path: string;
  children?: ReactNode;
}

const LinkButton = ({ text, path, children }: Props) => {
  return (
    <Link href={path}>
      <Button variant={"link"}>
        {children}
        {text}
      </Button>
    </Link>
  );
};

export default LinkButton;
