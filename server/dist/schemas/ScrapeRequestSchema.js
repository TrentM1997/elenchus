import { Type } from '@sinclair/typebox';
export const ScrapeRequestSchema = Type.Object({
    articles: Type.Array(Type.Object({
        url: Type.String(),
        source: Type.String(),
        date: Type.String(),
        logo: Type.String(),
        title: Type.String(),
        image: Type.String()
    }))
});
//# sourceMappingURL=ScrapeRequestSchema.js.map