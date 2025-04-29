import { getSongById, getSongAuthorsBySongID } from "@/actions/databaseActions";
import { EditSong } from "@/components/EditSong";
import EditTrigger from "@/components/EditTrigger";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { FILE_TYPES, FILE_TYPES_MAP } from "@/lib/constants";
import {getTranslations} from 'next-intl/server';

import Link from "next/link";
import { ReactNode } from "react";

export default async function Song({ params }: { params: Promise<{ songId: string }> }) {
  const t = await getTranslations();
  const { songId } = await params;
  const song = await getSongById({ songId: songId });
  const songAuthors = await getSongAuthorsBySongID({ songId: songId });

  const composers = songAuthors.filter((author) => author.isMusicAuthor);
  const lyricists = songAuthors.filter((author) => author.isLyricsAuthor);
  const otherAuthors = songAuthors.filter(
    (author) => !author.isLyricsAuthor && !author.isMusicAuthor
  );

  return (
    <Sheet>
      <div className="my-8">
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-row items-baseline justify-between">
            <h1 className="flex items-center gap-8 text-6xl">
              {song.title}
              <EditTrigger />
              <EditSong songInfo={{ song, authors: songAuthors }} />
            </h1>
          </div>

          <h2 className="flex w-full items-center justify-between text-2xl">
            {song.subtitle}
            <div className="flex flex-row gap-2">
              <a
                href={`https://www.drive.google.com/uc?id=${song.pdfFile}&export=download`}
                target="_blank"
              >
                {FILE_TYPES_MAP[FILE_TYPES.PDF]}
              </a>

              {song.musescoreFile && (
                <a
                  href={`https://www.drive.google.com/uc?id=${song.musescoreFile}&export=download`}
                  target="_blank"
                >
                  {FILE_TYPES_MAP[FILE_TYPES.MUSESCORE]}
                </a>
              )}
              {song.audioFile && (
                <a
                  href={`https://www.drive.google.com/uc?id=${song.audioFile}&export=view`}
                  target="_blank"
                >
                  {FILE_TYPES_MAP[FILE_TYPES.AUDIO]}
                </a>
              )}
            </div>
          </h2>
          <div className="flex w-full flex-col gap-0">
            <div className="flex w-full flex-row justify-end">
              <p className="text-sm">
                {`${t("song")}: `}
                {composers.length === 1 ? (
                  <Link href={`/authors/${composers[0].ID}`}>{composers[0].name}</Link>
                ) : (
                  composers.reduce((acc: ReactNode[], composer, i) => {
                    acc.push(<Link href={`/authors/${composer.ID}`}>{composer.name}</Link>);

                    if (i < composers.length - 1) {
                      acc.push(", ");
                    }
                    return acc;
                  }, [])
                )}
              </p>
            </div>
            {lyricists.length > 0 && (
              <div className="flex w-full flex-row justify-end">
                <p className="text-sm">
                  {`${t("lyrics")}: `}
                  {lyricists.length === 1 ? (
                    <Link href={`/authors/${lyricists[0].ID}`}>{lyricists[0].name}</Link>
                  ) : (
                    lyricists.reduce((acc: ReactNode[], lyricist, i) => {
                      acc.push(<Link href={`/authors/${lyricist.ID}`}>{lyricist.name}</Link>);

                      if (i < lyricists.length - 1) {
                        acc.push(", ");
                      }
                      return acc;
                    }, [])
                  )}
                </p>
              </div>
            )}
            {otherAuthors.length > 0 && (
              <div className="flex w-full flex-col">
                {otherAuthors.map((author) => (
                  <div key={author.ID} className="flex w-full flex-row justify-end">
                    <p className="text-sm">{`${author.credit}: ${author.name}`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        <div className="flex flex-col gap-8">
          <embed
            type="application/pdf"
            src={`https://drive.google.com/file/d/${song.pdfFile}/preview`}
            width="500"
            height="375"
          />

          {song.audioFile && (
            <iframe
              // itemType="audio/*"
              height={60}
              src={`https://drive.google.com/file/d/${song.audioFile}/preview`}
              allow="autoplay"
            ></iframe>
          )}
        </div>

        <Separator className="my-4" />
        {song.lyrics && (
          <div className="flex w-full flex-col">
            <h3 className="text-xl">{t("lyrics")}</h3>
            <p className="whitespace-pre text-wrap break-normal text-sm">{song.lyrics}</p>
            <Separator className="my-4" />
          </div>
        )}
        {song.details && (
          <div className="flex w-full flex-col">
            <h3 className="text-xl">{t("details")}</h3>
            <p className="whitespace-pre text-wrap break-normal text-sm">{song.details}</p>
            <Separator className="my-4" />
          </div>
        )}
      </div>
    </Sheet>
  );
}
