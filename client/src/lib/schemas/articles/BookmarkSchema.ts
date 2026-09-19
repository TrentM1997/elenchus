import { Type, Static } from "@sinclair/typebox";
import { PersistenceFailedResponseSchema } from "../auth/PersistenceFailedSchema";
import { ArticleSchema } from "./ArticleSchema";

export const BookmarkArticleIdSchema = Type.Number();

export type BookmarkArticleIdSchemaType = Static<
  typeof BookmarkArticleIdSchema
>;

export const BookmarkSchema = Type.Object({
  article_id: BookmarkArticleIdSchema,
  created_at: Type.String(),
  id: Type.String(),
  updated_at: Type.Union([Type.String(), Type.Null()]),
  user_id: Type.String(),
});

const BookmarkSavedSchema = Type.Object({
  ok: Type.Literal(true),
  data: BookmarkSchema,
});

const BookmarkedArticlesSuccessSchema = Type.Object({
  ok: Type.Literal(true),
  data: Type.Array(BookmarkSchema),
});

export const BookmarkResponseSchema = Type.Union([
  BookmarkSavedSchema,
  PersistenceFailedResponseSchema,
]);

export const BookmarkedArticlesResponseSchema = Type.Union([
  Type.Object({
    data: Type.Array(ArticleSchema),
    ok: Type.Literal(true),
  }),
  PersistenceFailedResponseSchema,
]);

export type BookmarkedArticlesResponseSchemaType = Static<
  typeof BookmarkedArticlesResponseSchema
>;

export type BookmarkResponseSchemaType = Static<typeof BookmarkResponseSchema>;

export type BookmarkSchemaType = Static<typeof BookmarkSchema>;

export type BookmarkResponse =
  | { ok: true; data: BookmarkSchemaType }
  | { ok: false; message: string; details: string };

export type BookmarkDeleteResponse =
  | { ok: false; message: string; cause?: unknown }
  | { ok: true; data: BookmarkSchemaType };

export type BookmarkedArticlesResponse =
  | {
      ok: true;
      data: BookmarkSchemaType[];
    }
  | {
      ok: false;
      message: string;
      details: string;
    };
