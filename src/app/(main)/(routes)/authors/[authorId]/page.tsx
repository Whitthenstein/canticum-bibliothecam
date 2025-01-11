import { getAuthorByID, getSongsByAuthorID } from "@/actions/databaseActions";
import { EditAuthor } from "@/components/EditAuthor";
import EditTrigger from "@/components/EditTrigger";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { AUTHOR_TYPES } from "@/db/schema";
import { getSongsResultsListArray } from "@/lib/helperFunctions";
import { TRANSLATIONS } from "@/lib/translations";

const page = async ({ params }: { params: Promise<{ authorId: string }> }) => {
  const { authorId } = await params;
  const author = await getAuthorByID({ authorID: authorId });
  const authorSongs = await getSongsByAuthorID({ authorID: authorId });

  const authorTypes: string[] = [];
  author.isComposer && authorTypes.push(TRANSLATIONS.pt[AUTHOR_TYPES.COMPOSER]);
  author.isLyricist && authorTypes.push(TRANSLATIONS.pt[AUTHOR_TYPES.LYRICIST]);
  const authorTypeInfo =
    authorTypes.length === 1
      ? authorTypes[0]
      : `${authorTypes[0]} ${TRANSLATIONS.pt.and} ${authorTypes[1]}`;

  return (
    <Sheet>
      <div className="my-8 flex w-full flex-col">
        <h1 className="flex items-center gap-8 text-6xl">
          {author.name}
          <EditTrigger />
          <EditAuthor author={author} />
        </h1>
        <h2 className="text-2xl">{authorTypeInfo}</h2>
        <Separator className="my-4" />
        {author.biography && (
          <>
            <h3 className="text-xl">{TRANSLATIONS.pt.biography}</h3>
            <p className="text-sm">{author.biography}</p>
            <Separator className="my-4" />
          </>
        )}
        {/* {author} */}
        <h3 className="text-xl">{TRANSLATIONS.pt.songs}</h3>
        {/* NO SONGS */}
        {authorSongs.length === 0 && <p className="text-sm">{TRANSLATIONS.pt.authorHasNoSongs}</p>}

        {/* HAS SONGS */}
        {authorSongs.length >= 1 && (
          <ul className="w-full items-center justify-center py-6">
            {getSongsResultsListArray(authorSongs)}
          </ul>
        )}
      </div>
    </Sheet>
  );
};

export default page;
