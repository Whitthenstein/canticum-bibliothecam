import { getSongs, getSongsWithQuery } from "@/actions/databaseActions";

import SearchBox from "@/components/SearchBox";

import { getSongsResultsListArray } from "@/lib/helperFunctions";
import { TRANSLATIONS } from "@/lib/translations";

const Songs = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const songs = !!query ? await getSongsWithQuery(query) : await getSongs();

  return (
    <div className="flex w-full flex-col items-center justify-center py-14">
      <SearchBox placeholder={TRANSLATIONS.pt.searchSongs} />
      <ul className="w-full items-center justify-center py-6">{getSongsResultsListArray(songs)}</ul>
    </div>
  );
};

export default Songs;
