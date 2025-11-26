import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

export const BiasSchema = Type.Union([
    Type.Literal("Left"),
    Type.Literal("Left-Center"),
    Type.Literal("Center"),
    Type.Literal("Right-Center"),
    Type.Literal("Right"),
    Type.Literal("Conspiracy-Pseudoscience"),
    Type.Literal("Questionable"),
    Type.Literal("LeastBiased"),
    Type.Literal("Satire"),
    Type.Literal("Pro-Science"),
    Type.Literal("Unknown"),
    Type.Null()
]);

export type BiasSchema = Static<typeof BiasSchema>;