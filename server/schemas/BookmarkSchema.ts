import { Type, Static } from "@sinclair/typebox";

export const BookmarkSchema = Type.Object({
  article_id: Type.String(),
  created_at: Type.String(),
  id: Type.String(),
  updated_at: Type.Union([Type.String(), Type.Null()]),
  user_id: Type.String(),
});

export type BookmarkSchemaType = Static<typeof BookmarkSchema>;
