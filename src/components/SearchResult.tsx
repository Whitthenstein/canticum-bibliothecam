import React, { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import Link from "next/link";

interface Props {
  text: string;
  Icons: { Icon: ReactNode; iconText: string }[];
  urlPath?: string;
}

const SearchResultBody = ({ text, Icons }: Props) => {
  return (
    <Badge variant="default" className="w-full cursor-pointer justify-between p-3">
      {text}
      <div className="flex flex-row gap-4">
        {Icons.map((iconObject, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger>
                <div>{iconObject.Icon}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{iconObject.iconText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </Badge>
  );
};

const SearchResult = ({ text, Icons, urlPath }: Props) => {
  return urlPath ? (
    <Link href={urlPath}>
      <SearchResultBody text={text} Icons={Icons} />
    </Link>
  ) : (
    <SearchResultBody text={text} Icons={Icons} />
  );
};

export default SearchResult;
