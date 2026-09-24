import { BrowsingOptionSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";

export interface Page {
  index: number;
  urlHash: Set<string>;
  select: (article: BrowsingOptionSchemaType) => () => void;
}
