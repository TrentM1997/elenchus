import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
export const InvestigationSchema = Type.Object({
    biases: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    changed_opinion: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
    created_at: Type.Optional(Type.String()),
    ending_perspective: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    had_merit: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
    id: Type.Optional(Type.Number()),
    idea: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    initial_perspective: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    new_concepts: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
    premises: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    sources: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
    takeaway: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    user_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    wikipedia_extracts: Type.Optional(Type.Union([Type.Array(Type.Any()), Type.Null()]))
});
const validator = TypeCompiler.Compile(InvestigationSchema);
export const validateInvestigation = (investigation) => {
    const isValid = validator.Check(investigation);
    const details = [...validator.Errors(investigation)];
    return { isValid, details };
};
//# sourceMappingURL=InvestigationSchema.js.map