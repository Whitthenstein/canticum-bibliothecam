import React from "react";
import {getTranslations} from 'next-intl/server';

import SearchBox from "@/components/SearchBox";

import { getAuthorsWithQuery, getSongsWithQuery } from "@/actions/databaseActions";
import { getAuthorsResultsListArray, getSongsResultsListArray } from "@/lib/helperFunctions";

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const t = await getTranslations();
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;

  const songs = await getSongsWithQuery(query);
  const authors = await getAuthorsWithQuery(query);

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={t("searchAuthorsAndSongs")} />
      {query && (
        <ul className="w-full items-center justify-center py-6">
          {await getSongsResultsListArray(songs)}
          {await getAuthorsResultsListArray(authors)}
        </ul>
      )}
    </div>
  );
}
