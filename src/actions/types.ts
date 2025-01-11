import { AUTHOR_TYPES } from "@/db/schema";

export interface UnifiedAuthor {
  name: string;
  biography: string | null;
  ID: number;
  createdAt: Date;
  updateAt: Date | null;
  authorTypes: AUTHOR_TYPES[];
}
