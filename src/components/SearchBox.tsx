"use client";

import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface Props {
  placeholder: string;
}

const SearchBox = ({ placeholder }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Input
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
      className="w-[50%] p-2 text-center"
      placeholder={placeholder}
    />
  );
};

export default SearchBox;
