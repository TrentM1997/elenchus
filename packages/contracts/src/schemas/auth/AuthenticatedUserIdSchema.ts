import { Type, Static } from "@sinclair/typebox";
import "../typeBoxFormats.js";

export const AuthenticatedUserIdSchema = Type.String({ format: "uuid" });

export type AuthenticatedUserIdSchemaType = Static<
  typeof AuthenticatedUserIdSchema
>;
