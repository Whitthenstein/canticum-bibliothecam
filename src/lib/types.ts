import { SelectAuthor } from "@/db/schema";

export type AuthorsMap = { [ID: string]: SelectAuthor };

export type OtherAuthorInfo = { ID: string; name: string; credit: string };
