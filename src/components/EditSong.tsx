"use client";

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SelectAuthorOfSong, SelectSong } from "@/db/schema";
import { SongForm } from "./SongForm";

interface Props {
  songInfo?: { song: SelectSong; authors: SelectAuthorOfSong[] };
}

export function EditSong({ songInfo }: Props) {
  return (
    <SheetContent className="overflow-auto">
      <SheetHeader>
        <SheetTitle>Editar Música</SheetTitle>
        <SheetDescription>
          Faça mudanças às informações da música e clique Submeter quando terminar.
        </SheetDescription>
      </SheetHeader>
      <SongForm songInfo={songInfo} />
    </SheetContent>
  );
}
