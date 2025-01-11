import SearchResult from "@/components/SearchResult";

import { SelectAuthor, SelectSong } from "@/db/schema";

import { AUTHOR_TYPES_MAP, FILE_TYPES_MAP } from "./constants";
import { TRANSLATIONS } from "./translations";

export const buildSearchString = (stringChunksArray: string[]) => {
  const searchString = stringChunksArray
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return searchString.concat(stringChunksArray.join(" "));
};

export const getSongsResultsListArray = (songs: SelectSong[]) => {
  return songs.map((song) => {
    const icons = [{ Icon: FILE_TYPES_MAP["pdfFile"], iconText: TRANSLATIONS.pt["pdfFile"] }];

    if (song.musescoreFile) {
      icons.push({
        Icon: FILE_TYPES_MAP["musescoreFile"],
        iconText: TRANSLATIONS.pt["musescoreFile"]
      });
    }

    if (song.audioFile) {
      icons.push({ Icon: FILE_TYPES_MAP["audioFile"], iconText: TRANSLATIONS.pt["audioFile"] });
    }

    return (
      <li key={`${song.ID}-${song.title}`}>
        <SearchResult urlPath={`/songs/${song.ID}`} text={song.title} Icons={icons} />
      </li>
    );
  });
};

export const getAuthorsResultsListArray = (authors: SelectAuthor[]) => {
  return authors.map((author) => {
    const Icons = [];

    if (author.isComposer) {
      Icons.push({ Icon: AUTHOR_TYPES_MAP.Composer, iconText: TRANSLATIONS.pt.Composer });
    }

    if (author.isLyricist) {
      Icons.push({ Icon: AUTHOR_TYPES_MAP.Lyricist, iconText: TRANSLATIONS.pt.Lyricist });
    }

    return (
      <li key={`${author.ID}-${author.name}`} className="py-1">
        <SearchResult urlPath={`/authors/${author.ID}`} text={author.name} Icons={Icons} />
      </li>
    );
  });
};
