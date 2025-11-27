import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
export const SourceSchema = Type.Object({
    id: Type.Union([Type.String(), Type.Null()]),
    name: Type.String()
});
export const SearchResultsSchema = Type.Object({
    source: SourceSchema,
    author: Type.Union([Type.String(), Type.Null()]),
    title: Type.String(),
    description: Type.String(),
    url: Type.String(),
    urlToImage: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    publishedAt: Type.String(),
    content: Type.Optional(Type.String())
});
export const validator = TypeCompiler.Compile(SearchResultsSchema);
export const validateSearchResult = (result) => {
    const isValid = validator.Check(result);
    const details = [...validator.Errors(result)];
    return { isValid, details };
};
//# sourceMappingURL=SearchResultsSchema.js.map