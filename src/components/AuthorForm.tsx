"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { AUTHOR_TYPES, SelectAuthor } from "@/db/schema";
import { getValues } from "@/lib/enum";
import { Textarea } from "@/components/ui/textarea";
import { TRANSLATIONS } from "@/lib/translations";
import { addAuthor, editAuthor } from "@/actions/databaseActions";
import { useState } from "react";
import AnimatedLoadingCircle from "@/components/AnimatedLoadingCircle";

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: TRANSLATIONS.pt.authorNameWarning
  }),
  authorTypes: z
    .array(z.enum(getValues(AUTHOR_TYPES)))
    .refine((value) => value.some((item) => item), {
      message: TRANSLATIONS.pt.authorTypeSelectionWarning
    }),
  biography: z.string().trim()
});

interface Props {
  author?: SelectAuthor;
}

export const AuthorForm = ({ author }: Props) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultAuthorTypes: AUTHOR_TYPES[] = [];

  if (!author) {
    defaultAuthorTypes.push(AUTHOR_TYPES.COMPOSER);
  } else {
    if (author.isComposer) {
      defaultAuthorTypes.push(AUTHOR_TYPES.COMPOSER);
    }
    if (author.isLyricist) {
      defaultAuthorTypes.push(AUTHOR_TYPES.LYRICIST);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: author?.name || "",
      biography: author?.biography || "",
      authorTypes: defaultAuthorTypes
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, biography, authorTypes } = values;

    setIsSubmitting(true);

    const newAuthor = {
      name,
      biography,
      isComposer: authorTypes.includes(AUTHOR_TYPES.COMPOSER),
      isLyricist: authorTypes.includes(AUTHOR_TYPES.LYRICIST)
    };

    if (!author) {
      await addAuthor(newAuthor);
      toast({
        title: TRANSLATIONS.pt.authorAddedTitle,
        description: `${name} ${TRANSLATIONS.pt.authorAddedDescription}.`
      });
      form.reset();
      setIsSubmitting(false);
    } else {
      await editAuthor({ ...newAuthor, ID: author.ID });
      toast({
        title: TRANSLATIONS.pt.authorEditedTitle,
        description: `${name} ${TRANSLATIONS.pt.authorEditedDescription}.`
      });
      setIsSubmitting(false);
      location.reload();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${TRANSLATIONS.pt.name} *`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="António Cartageno" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorTypes"
          render={() => (
            <FormItem>
              <FormLabel>{`${TRANSLATIONS.pt.authorType} *`}</FormLabel>
              {getValues(AUTHOR_TYPES).map((type, index) => (
                <FormField
                  key={`${type}-${index}`}
                  control={form.control}
                  name="authorTypes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={`${type}-${index}`}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(type)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, type])
                                : field.onChange(field.value?.filter((value) => value !== type));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {TRANSLATIONS.pt[type]}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TRANSLATIONS.pt.biography}</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="flex items-center justify-center" type="submit">
          {isSubmitting ? <AnimatedLoadingCircle /> : TRANSLATIONS.pt.submit}
        </Button>
      </form>
    </Form>
  );
};
