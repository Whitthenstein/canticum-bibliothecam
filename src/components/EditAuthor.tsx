"use client";

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SelectAuthor } from "@/db/schema";
import { AuthorForm } from "./AuthorForm";

type Props = {
  author: SelectAuthor;
};

export function EditAuthor({ author }: Props) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Editar Autor</SheetTitle>
        <SheetDescription>
          Faça mudanças às informações do autor e clique Submeter quando terminar.
        </SheetDescription>
      </SheetHeader>
      <AuthorForm author={author} />
    </SheetContent>
  );
}
