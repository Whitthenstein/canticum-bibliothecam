import React from "react";

import { getAuthorsWithQuery, getSongsWithQuery } from "@/actions/databaseActions";

import SearchBox from "@/components/SearchBox";

import { getAuthorsResultsListArray, getSongsResultsListArray } from "@/lib/helperFunctions";
import { TRANSLATIONS } from "@/lib/translations";

export const Home = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  // const currentPage = Number(searchParams?.page) || 1;

  const songs = await getSongsWithQuery(query);
  const authors = await getAuthorsWithQuery(query);

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={TRANSLATIONS.pt.searchAuthorsAndSongs} />
      {query && (
        <ul className="w-full items-center justify-center py-6">
          {getSongsResultsListArray(songs)}
          {getAuthorsResultsListArray(authors)}
        </ul>
      )}
    </div>
  );
};

export default Home;
