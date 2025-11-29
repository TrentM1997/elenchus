import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';


export const ScrapeRequestSchema = Type.Object({
    articles: Type.Array(
        Type.Object({
            url: Type.String(),
            source: Type.String(),
            date: Type.String(),
            logo: Type.String(),
            title: Type.String(),
            image: Type.String()
        })
    )
});

export type ScrapeRequestSchema = Static<typeof ScrapeRequestSchema>;