"use server";

import { db } from "@/db";
import {
  authorsTable,
  discographyTable,
  InsertAuthor,
  SelectAuthorOfSong,
  songsTable
} from "@/db/schema";
import { buildSearchString } from "@/lib/helperFunctions";
import { OtherAuthorInfo } from "@/lib/types";
import { like, and, asc, eq } from "drizzle-orm";

// AUTHORS

export const addAuthor = async ({ name, biography, isComposer, isLyricist }: InsertAuthor) => {
  const searchString = buildSearchString([name]);
  await db
    .insert(authorsTable)
    .values({ name, biography, isComposer, isLyricist, authorSearch: searchString });
};

export const editAuthor = async ({ name, biography, isComposer, isLyricist, ID }: InsertAuthor) => {
  const searchString = buildSearchString([name]);
  await db
    .update(authorsTable)
    .set({ name, biography, isComposer, isLyricist, authorSearch: searchString })
    .where(eq(authorsTable.ID, ID!));
};

export const getAuthorByID = async (payload: { authorID: string }) => {
  const { authorID } = payload;
  const result = await db.select().from(authorsTable).where(eq(authorsTable.ID, authorID));

  if (result.length === 0) {
    console.error(`No such author found with ID - ${authorID}`);
  }

  if (result.length > 1) {
    console.error(`Found ${result.length} authors with ID - ${authorID}`);
  }

  return result[0];
};

export const getAuthors = async () => {
  return await db.select().from(authorsTable).orderBy(asc(authorsTable.name));
};

export const getAuthorsWithQuery = async (query: string) => {
  return await db
    .select()
    .from(authorsTable)
    .where(like(authorsTable.authorSearch, `%${query.toLocaleLowerCase()}%`))
    .orderBy(asc(authorsTable.name));
};

// SONGS

export const addSong = async (values: {
  title: string;
  subtitle?: string;
  composers: string[];
  lyricists: string[];
  authors: OtherAuthorInfo[];
  lyrics?: string;
  details?: string;
  pdfFileID: string;
  musescoreFileID?: string;
  audioFileID?: string;
}) => {
  const {
    title,
    subtitle,
    composers,
    lyricists,
    authors,
    lyrics,
    details,
    pdfFileID,
    musescoreFileID,
    audioFileID
  } = values;

  const searchString = buildSearchString([title, subtitle || "", lyrics || "", details || ""]);

  await db.transaction(async (tx) => {
    const [newSong] = await tx
      .insert(songsTable)
      .values({
        title,
        subtitle,
        lyrics,
        details,
        pdfFile: pdfFileID,
        musescoreFile: musescoreFileID,
        audioFile: audioFileID,
        songSearch: searchString
      })
      .returning({ ID: songsTable.ID });

    // Add composers
    for (const ID of composers) {
      await tx
        .insert(discographyTable)
        .values({ songID: newSong.ID, authorID: ID, isMusicAuthor: true });
    }

    // Add lyricists
    for (const ID of lyricists) {
      await tx
        .insert(discographyTable)
        .values({ songID: newSong.ID, authorID: ID, isLyricsAuthor: true });
    }

    // Other authors
    for (const author of authors) {
      await tx
        .insert(discographyTable)
        .values({ songID: newSong.ID, authorID: author.ID, credit: author.credit });
    }
  });
};

export const editSong = async (values: {
  ID: string;
  title: string;
  subtitle?: string;
  composers: string[];
  lyricists: string[];
  authors: OtherAuthorInfo[];
  lyrics?: string;
  details?: string;
  pdfFileID?: string;
  musescoreFileID?: string;
  audioFileID?: string;
}) => {
  const {
    ID,
    title,
    subtitle,
    composers,
    lyricists,
    authors,
    lyrics,
    details,
    pdfFileID,
    musescoreFileID,
    audioFileID
  } = values;

  const searchString = buildSearchString([title, subtitle || "", lyrics || "", details || ""]);

  await db.transaction(async (tx) => {
    const songAuthors = await getSongAuthorsBySongID({ songId: ID });
    const oldComposers = songAuthors.filter((author) => author.isMusicAuthor);
    const oldLyricists = songAuthors.filter((author) => author.isLyricsAuthor);
    const oldOtherAuthors = songAuthors.filter(
      (author) => !author.isMusicAuthor && !author.isLyricsAuthor
    );

    const composersToRemove = oldComposers.filter(
      (oldComposer) => !composers.find((composerID) => composerID === oldComposer.ID)
    );
    const composersToAdd = composers.filter(
      (composerID) => !oldComposers.find((oldComposer) => oldComposer.ID === composerID)
    );

    const lyricistsToRemove = oldLyricists.filter(
      (oldLyricist) => !lyricists.find((lyricistID) => lyricistID === oldLyricist.ID)
    );
    const lyricistsToAdd = lyricists.filter(
      (lyricistID) => !oldLyricists.find((oldLyricist) => oldLyricist.ID === lyricistID)
    );

    const otherAuthorsToRemove = oldOtherAuthors.filter(
      (oldOtherAuthor) => !authors.find((author) => author.ID === oldOtherAuthor.ID)
    );
    const otherAuthorsToAdd = authors.filter(
      (author) => !oldOtherAuthors.find((oldOtherAuthor) => oldOtherAuthor.ID === author.ID)
    );
    const otherAuthorsToEdit = authors.filter((author) =>
      oldOtherAuthors.find((oldOtherAuthor) => oldOtherAuthor.ID === author.ID)
    );

    await tx
      .update(songsTable)
      .set({
        title,
        subtitle,
        lyrics,
        details,
        pdfFile: pdfFileID,
        musescoreFile: musescoreFileID,
        audioFile: audioFileID,
        songSearch: searchString
      })
      .where(eq(songsTable.ID, ID!));

    // Composers
    for (const composerID of composersToAdd) {
      await tx
        .insert(discographyTable)
        .values({ songID: ID, authorID: composerID, isMusicAuthor: true });
    }
    for (const composer of composersToRemove) {
      await tx
        .delete(discographyTable)
        .where(and(eq(discographyTable.songID, ID), eq(discographyTable.authorID, composer.ID)));
    }

    // Add lyricists
    for (const lyricistID of lyricistsToAdd) {
      await tx
        .insert(discographyTable)
        .values({ songID: ID, authorID: lyricistID, isLyricsAuthor: true });
    }
    for (const lyricist of lyricistsToRemove) {
      await tx
        .delete(discographyTable)
        .where(and(eq(discographyTable.songID, ID), eq(discographyTable.authorID, lyricist.ID)));
    }

    // Other authors
    for (const otherAuthor of otherAuthorsToAdd) {
      await tx
        .insert(discographyTable)
        .values({ songID: ID, authorID: otherAuthor.ID, credit: otherAuthor.credit });
    }
    for (const otherAuthor of otherAuthorsToRemove) {
      await tx
        .delete(discographyTable)
        .where(and(eq(discographyTable.songID, ID), eq(discographyTable.authorID, otherAuthor.ID)));
    }
    for (const otherAuthor of otherAuthorsToEdit) {
      await tx
        .update(discographyTable)
        .set({ credit: otherAuthor.credit })
        .where(and(eq(discographyTable.songID, ID), eq(discographyTable.authorID, otherAuthor.ID)));
    }
  });
};

export const getSongById = async (payload: { songId: string }) => {
  const { songId } = payload;
  const result = await db.select().from(songsTable).where(eq(songsTable.ID, songId));

  if (result.length === 0) {
    console.error(`No such song found with ID - ${songId}`);
  }

  if (result.length > 1) {
    console.error(`Found ${result.length} songs with ID - ${songId}`);
  }

  return result[0];
};

export const getSongs = async () => {
  return await db.select().from(songsTable).orderBy(asc(songsTable.title));
};

export const getSongsWithQuery = async (query: string) => {
  return await db
    .select()
    .from(songsTable)
    .where(like(songsTable.songSearch, `%${query.toLocaleLowerCase()}%`))
    .orderBy(asc(songsTable.title));
};

export const getSongsByAuthorID = async (payload: { authorID: string }) => {
  const { authorID } = payload;
  const resultArray = await db
    .selectDistinct({ songs: songsTable })
    .from(discographyTable)
    .innerJoin(songsTable, eq(songsTable.ID, discographyTable.songID))
    .where(eq(discographyTable.authorID, authorID))
    .orderBy(asc(songsTable.title));

  return resultArray.map((result) => result.songs);
};

export const getSongAuthorsBySongID = async (payload: {
  songId: string;
}): Promise<SelectAuthorOfSong[]> => {
  const { songId } = payload;
  const resultArray = await db
    .select({
      ID: authorsTable.ID,
      name: authorsTable.name,
      isComposer: authorsTable.isComposer,
      isLyricist: authorsTable.isLyricist,
      biography: authorsTable.biography,
      isMusicAuthor: discographyTable.isMusicAuthor,
      isLyricsAuthor: discographyTable.isLyricsAuthor,
      credit: discographyTable.credit
    })
    .from(discographyTable)
    .innerJoin(authorsTable, eq(authorsTable.ID, discographyTable.authorID))
    .where(eq(discographyTable.songID, songId))
    .orderBy(asc(authorsTable.name));

  return resultArray;
};
