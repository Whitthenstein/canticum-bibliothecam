import { getSongs, getSongsWithQuery } from "@/actions/databaseActions";
import {getTranslations} from 'next-intl/server';

import SearchBox from "@/components/SearchBox";

import { getSongsResultsListArray } from "@/lib/helperFunctions";

export default async function Songs(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const t = await getTranslations();
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const songs = query ? await getSongsWithQuery(query) : await getSongs();

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={t("searchSongs")} />
      <ul className="w-full items-center justify-center py-6">
        {await getSongsResultsListArray(songs)}
      </ul>
    </div>
  );
}
