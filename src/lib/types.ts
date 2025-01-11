import { SelectAuthor } from "@/db/schema";

export type AuthorsMap = Record<string, SelectAuthor>;

export interface OtherAuthorInfo {
  ID: string;
  name: string;
  credit: string;
}
