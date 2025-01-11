import { getAuthors, getAuthorsWithQuery } from "@/actions/databaseActions";

import SearchBox from "@/components/SearchBox";

import { getAuthorsResultsListArray } from "@/lib/helperFunctions";
import { TRANSLATIONS } from "@/lib/translations";

import React from "react";

export default async function Authors(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const authors = query ? await getAuthorsWithQuery(query) : await getAuthors();

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={TRANSLATIONS.pt.searchAuthors} />
      <ul className="w-full items-center justify-center py-6">
        {getAuthorsResultsListArray(authors)}
      </ul>
    </div>
  );
}
