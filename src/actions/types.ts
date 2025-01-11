import { AUTHOR_TYPES } from "@/db/schema";

export type UnifiedAuthor = {
  name: string;
  biography: string | null;
  ID: number;
  createdAt: Date;
  updateAt: Date | null;
  authorTypes: AUTHOR_TYPES[];
};
