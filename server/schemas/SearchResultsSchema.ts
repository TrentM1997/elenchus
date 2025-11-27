import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { Static } from '@sinclair/typebox';

export const SourceSchema = Type.Object({
    id: Type.Union([Type.String(), Type.Null()]),
    name: Type.String()
});

export type SourceSchema = Static<typeof SourceSchema>;

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


export const validateSearchResult = (result: any) => {

    const isValid = validator.Check(result);
    const details = [...validator.Errors(result)];

    return { isValid, details } as const;
};

export type SearchResultsSchema = Static<typeof SearchResultsSchema>;
