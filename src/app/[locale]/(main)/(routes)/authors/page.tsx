import React from "react";
import { getAuthors, getAuthorsWithQuery } from "@/actions/databaseActions";
import {getTranslations} from 'next-intl/server';

import SearchBox from "@/components/SearchBox";

import { getAuthorsResultsListArray } from "@/lib/helperFunctions";


export default async function Authors(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const t = await getTranslations();
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const authors = query ? await getAuthorsWithQuery(query) : await getAuthors();

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={t("searchAuthors")} />
      <ul className="w-full items-center justify-center py-6">
        {await getAuthorsResultsListArray(authors)}
      </ul>
    </div>
  );
}
