import { Type, type Static } from "@sinclair/typebox";

const NullableString = Type.Union([Type.String(), Type.Null()]);

// Validate after trimming the input.
export const WikipediaTermSchema = Type.String({
  minLength: 1,
  pattern: "\\S",
});

// Upstream objects allow unrelated Wikipedia fields.
const upstream = { additionalProperties: true };

const WikipediaImageSchema = Type.Object(
  {
    source: Type.String(),
    width: Type.Integer(),
    height: Type.Integer(),
  },
  upstream,
);

// GET /api/rest_v1/page/summary/{title}
export const WikipediaSummarySchema = Type.Object(
  {
    type: Type.Union([
      Type.Literal("standard"),
      Type.Literal("disambiguation"),
      Type.Literal("no-extract"),
      Type.Literal("mainpage"),
    ]),
    title: Type.String(),
    extract: Type.String(),
    timestamp: Type.String(),
    description: Type.Optional(Type.String()),
    thumbnail: Type.Optional(WikipediaImageSchema),
    content_urls: Type.Object(
      {
        desktop: Type.Object({ page: Type.String() }, upstream),
      },
      upstream,
    ),
  },
  upstream,
);

// GET /w/api.php with formatversion=2,
// generator=links, prop=extracts|pageimages
const WikipediaExistingPageSchema = Type.Object(
  {
    pageid: Type.Integer({ minimum: 1 }),
    ns: Type.Integer(),
    title: Type.String(),
    missing: Type.Optional(Type.Literal(false)),
    extract: Type.Optional(Type.String()),
    thumbnail: Type.Optional(WikipediaImageSchema),
  },
  upstream,
);

const WikipediaMissingPageSchema = Type.Object(
  {
    ns: Type.Integer(),
    title: Type.String(),
    missing: Type.Literal(true),
  },
  upstream,
);

export const WikipediaLinksSchema = Type.Object(
  {
    // Prevent API error bodies from passing as empty results.
    error: Type.Optional(Type.Never()),
    batchcomplete: Type.Optional(Type.Boolean()),
    query: Type.Optional(
      Type.Object(
        {
          pages: Type.Array(
            Type.Union([
              WikipediaExistingPageSchema,
              WikipediaMissingPageSchema,
            ]),
          ),
        },
        upstream,
      ),
    ),
    continue: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])),
    ),
  },
  upstream,
);

// Default Action API error format.
// This is separate from your application's { kind: "error" }.
export const WikipediaActionErrorSchema = Type.Object(
  {
    error: Type.Object(
      {
        code: Type.String(),
        info: Type.String(),
      },
      upstream,
    ),
  },
  upstream,
);

export type WikipediaSummaryType = Static<typeof WikipediaSummarySchema>;
export type WikipediaLinks = Static<typeof WikipediaLinksSchema>;

export const WikiDisambigCandidateSchema = Type.Object({
  pageid: Type.Integer({ minimum: 1 }),
  title: Type.String(),
  extract: Type.String(),
  thumbnail: NullableString,
  url: Type.String(),
  lastUpdated: NullableString,
});

export const WikiSummaryResponseSchema = Type.Object({
  kind: Type.Literal("summary"),
  title: Type.String(),
  extract: Type.String(),
  description: Type.String(),
  thumbnail: NullableString,
  pageUrl: Type.String(),
  lastUpdated: NullableString,
});

export const WikiDisambigResponseSchema = Type.Object({
  kind: Type.Literal("disambiguation"),
  title: Type.String(),
  pageUrl: Type.String(),
  candidates: Type.Array(WikiDisambigCandidateSchema),
  lastUpdated: NullableString,
});

export const WikiErrorResponseSchema = Type.Object({
  kind: Type.Literal("error"),
  message: Type.String(),
});

export const WikiResponseSchema = Type.Union([
  WikiSummaryResponseSchema,
  WikiDisambigResponseSchema,
  WikiErrorResponseSchema,
]);

export type WikiResponse = Static<typeof WikiResponseSchema>;
export type WikiResponseSchemaType = Static<typeof WikiResponseSchema>;
export type WikiDisambigCandidate = Static<typeof WikiDisambigCandidateSchema>;
