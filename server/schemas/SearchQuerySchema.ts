import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';


export const SearchQuerySchema = Type.String();

export type SearchQuerySchema = Static<typeof SearchQuerySchema>;