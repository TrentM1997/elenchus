import { Type, Static } from "@sinclair/typebox";

export const AuthenticatedRequestSchema = Type.String({ minLength: 1 });

export type AuthenticatedRequestSchemaType = Static<
  typeof AuthenticatedRequestSchema
>;
