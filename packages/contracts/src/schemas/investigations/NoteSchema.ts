import { Type, Static } from "@sinclair/typebox";

const NoteJsonMarksSchema = Type.Object(
  {
    type: Type.String(),
    attrs: Type.Optional(Type.Record(Type.String(), Type.Any())),
  },
  { additionalProperties: true },
);

const NoteContentAttributesSchema = Type.Record(Type.String(), Type.Any());

export const NoteContentSchema = Type.Recursive((This) =>
  Type.Object(
    {
      type: Type.Optional(Type.String()),
      attrs: Type.Optional(NoteContentAttributesSchema),
      content: Type.Optional(Type.Array(This)),
      marks: Type.Optional(Type.Array(NoteJsonMarksSchema)),
      text: Type.Optional(Type.String()),
    },
    { additionalProperties: true },
  ),
);

export const NoteSchema = Type.Object({
  id: Type.String(),
  user_id: Type.String(),
  investigation_id: Type.Number(),
  created_at: Type.String(),
  content: NoteContentSchema,
});

export const NoteToPersistSchema = Type.Omit(NoteSchema, [
  "user_id",
  "id",
  "investigation_id",
  "created_at",
]);

export const NotesInputSchema = Type.Array(NoteToPersistSchema);

export type NotesInputSchemaType = Static<typeof NotesInputSchema>;

export type NoteSchemaType = Static<typeof NoteSchema>;
