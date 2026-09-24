import { Type, Static } from "@sinclair/typebox";

export const SearchQuerySchema = Type.String({ minLength: 1 });

export type SearchQuerySchemaType = Static<typeof SearchQuerySchema>;
