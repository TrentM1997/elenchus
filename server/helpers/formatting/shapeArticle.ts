import type { Bias, BiasInfo, MBFC, FirecrawlContent, Article, FcParam } from "../../types/types";

const shapeArticle = (c: FirecrawlContent, a: FcParam, mb: MBFC, urlClean: string): Article => {
    const rating: BiasInfo | null | undefined = mb.has(a.source)
        ? mb.get(a.source)
        : null;
    const { factual_reporting, bias, country } = rating ?? {};
    const { source, image, date, logo, title } = a;
    const { content_markdown } = c;

    const article_extracted: Article = {
        title: title,
        provider: source,
        authors: "N/A",
        article_url: urlClean,
        image_url: image,
        date_published: date ?? null,
        fallbackDate: date ?? null,
        summary: null,
        full_text: content_markdown,
        logo: logo,
        id: null,
        factual_reporting: factual_reporting ?? null,
        bias: bias as Bias,
        country: country
    };

    return article_extracted;
};

export { shapeArticle };