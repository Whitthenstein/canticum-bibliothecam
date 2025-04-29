import SearchResult from "@/components/SearchResult";
import {getTranslations} from 'next-intl/server';

import { SelectAuthor, SelectSong } from "@/db/schema";

import { AUTHOR_TYPES_MAP, FILE_TYPES_MAP } from "./constants";

export const buildSearchString = (stringChunksArray: string[]) => {
  const searchString = stringChunksArray
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return searchString.concat(stringChunksArray.join(" "));
};

export const getSongsResultsListArray = async (songs: SelectSong[]) => {
  const t = await getTranslations();
  return songs.map((song) => {
    const icons = [{ Icon: FILE_TYPES_MAP["pdfFile"], iconText: t("pdfFile") }];

    if (song.musescoreFile) {
      icons.push({
        Icon: FILE_TYPES_MAP["musescoreFile"],
        iconText: t("musescoreFile")
      });
    }

    if (song.audioFile) {
      icons.push({ Icon: FILE_TYPES_MAP["audioFile"], iconText: t("audioFile") });
    }

    return (
      <li key={`${song.ID}-${song.title}`} className="py-1">
        <SearchResult urlPath={`/songs/${song.ID}`} text={song.title} Icons={icons} />
      </li>
    );
  });
};

export const getAuthorsResultsListArray = async (authors: SelectAuthor[]) => {
  const t = await getTranslations();
  return authors.map((author) => {
    const Icons = [];

    if (author.isComposer) {
      Icons.push({ Icon: AUTHOR_TYPES_MAP.Composer, iconText: t("composer") });
    }

    if (author.isLyricist) {
      Icons.push({ Icon: AUTHOR_TYPES_MAP.Lyricist, iconText: t("lyricist") });
    }

    return (
      <li key={`${author.ID}-${author.name}`} className="py-1">
        <SearchResult urlPath={`/authors/${author.ID}`} text={author.name} Icons={Icons} />
      </li>
    );
  });
};
