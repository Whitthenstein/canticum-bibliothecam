import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectAuthor } from "@/db/schema";
import { useEffect } from "react";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

interface Props {
  otherAuthors: SelectAuthor[];
  fields: FieldArrayWithId<
    {
      otherAuthors: {
        ID: string;
        name: string;
        credit: string;
      }[];
      title: string;
      composers: string;
      pdfFile: File;
      details?: string | undefined;
      subtitle?: string | undefined;
      lyricists?: string | undefined;
      lyrics?: string | undefined;
      musescoreFile?: File | undefined;
      audioFile?: File | undefined;
    },
    "otherAuthors",
    "id"
  >[];
  append: UseFieldArrayAppend<
    {
      otherAuthors: {
        name: string;
        ID: string;
        credit: string;
      }[];
      title: string;
      composers: string;
      pdfFile: File;
      details?: string | undefined;
      subtitle?: string | undefined;
      lyricists?: string | undefined;
      lyrics?: string | undefined;
      musescoreFile?: File | undefined;
      audioFile?: File | undefined;
    },
    "otherAuthors"
  >;
  remove: UseFieldArrayRemove;
}

const OtherAuthorsInfo = ({ fields, otherAuthors, append }: Props) => {
  useEffect(() => {
    if (otherAuthors.length === 0) {
      return;
    }

    const author = otherAuthors.at(-1)!;

    if (fields.some((field) => field.ID === author.ID)) {
      return;
    }

    const authorInfo = { ID: author.ID, name: author.name, credit: "" };

    append(authorInfo);
  }, [otherAuthors]);

  return (
    <div>
      {fields.map((author, index) => (
        <div key={author.id}>
          <FormField
            // control={form.control}
            name={`otherAuthors.${index}.credit`}
            render={({ field }) => (
              <>
                <FormItem>
                  <FormControl>
                    <div>
                      <FormLabel>{author.name}</FormLabel>

                      <Input {...field} placeholder="Créditos..." />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default OtherAuthorsInfo;
