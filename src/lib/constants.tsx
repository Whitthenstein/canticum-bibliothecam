import { Music, PenTool, AudioLines, File, FileMusic } from "lucide-react";

import { AUTHOR_TYPES } from "@/db/schema";

export const FILE_TYPES = {
  PDF: "pdfFile",
  MUSESCORE: "musescoreFile",
  AUDIO: "audioFile"
} as const;
export type FILE_TYPES = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

export const AUTHOR_TYPES_MAP = {
  [AUTHOR_TYPES.COMPOSER]: <Music />,
  [AUTHOR_TYPES.LYRICIST]: <PenTool />
};

export const FILE_TYPES_MAP = {
  [FILE_TYPES.PDF]: <File />,
  [FILE_TYPES.MUSESCORE]: <FileMusic />,
  [FILE_TYPES.AUDIO]: <AudioLines />
};
