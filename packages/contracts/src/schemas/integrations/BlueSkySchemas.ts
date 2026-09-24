import { Type, type Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const BlueSkyPostSchema = Type.Object(
  {
    // 1. Root schema identifier type
    $type: Type.Optional(Type.Literal("app.bsky.feed.defs#postView")),

    uri: Type.String(),
    cid: Type.String(),

    author: Type.Object(
      {
        did: Type.String(),
        handle: Type.String(),
        displayName: Type.Optional(Type.String()),
        avatar: Type.Optional(Type.String()),
        associated: Type.Optional(Type.Record(Type.String(), Type.Any())),
      },
      { additionalProperties: true },
    ),

    record: Type.Object(
      {
        $type: Type.Literal("app.bsky.feed.post"),
        createdAt: Type.String(),
        text: Type.String(),
        langs: Type.Optional(Type.Array(Type.String())),
        facets: Type.Optional(
          Type.Array(
            Type.Object({
              index: Type.Object({
                byteStart: Type.Number(),
                byteEnd: Type.Number(),
              }),
              features: Type.Array(Type.Record(Type.String(), Type.Any())),
            }),
          ),
        ),
      },
      { additionalProperties: true },
    ),

    // 2. Counts are structurally optional in the ATProto spec definitions
    bookmarkCount: Type.Optional(Type.Number()),
    likeCount: Type.Optional(Type.Number()),
    quoteCount: Type.Optional(Type.Number()),
    replyCount: Type.Optional(Type.Number()),
    repostCount: Type.Optional(Type.Number()),

    indexedAt: Type.String(),
    labels: Type.Optional(Type.Array(Type.Any())),

    // Optional placeholder for rich-media attachment metadata
    embed: Type.Optional(Type.Any()),

    viewer: Type.Optional(
      Type.Object(
        {
          bookmarked: Type.Optional(Type.Boolean()),
          threadMuted: Type.Optional(Type.Boolean()),
          embeddingDisabled: Type.Optional(Type.Boolean()),
        },
        { additionalProperties: true },
      ),
    ),
  },
  { additionalProperties: true },
);

export const BlueSkyPostSchemaArray = Type.Array(BlueSkyPostSchema);

export const BlueSkyFeedItemSchema = Type.Object({
  post: BlueSkyPostSchema,
  reply: Type.Optional(Type.Any()),
  reason: Type.Optional(Type.Any()),
});

export const SplitBlueSkyFeedSchema = Type.Object({
  firstHalf: BlueSkyPostSchemaArray,
  secondHalf: BlueSkyPostSchemaArray,
});

export type SplitBlueSkyFeedSchemaType = Static<typeof SplitBlueSkyFeedSchema>;

export type BlueSkyPostSchemaArrayType = Static<typeof BlueSkyPostSchemaArray>;

export type BlueSkyPostSchemaType = Static<typeof BlueSkyPostSchema>;

export type BlueSkyFeedItemSchemaType = Static<typeof BlueSkyFeedItemSchema>;

export const PostValidator = TypeCompiler.Compile(BlueSkyPostSchema);

export const FeedItemValidator = TypeCompiler.Compile(BlueSkyFeedItemSchema);
