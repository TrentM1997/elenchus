const shapeArticle = (c, a, mb, urlClean) => {
    const rating = mb.has(a.source)
        ? mb.get(a.source)
        : null;
    const { factual_reporting, bias, country } = rating ?? {};
    const { source, image, date, logo, title } = a;
    const { content_markdown } = c;
    const article_extracted = {
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
        bias: bias,
        country: country
    };
    return article_extracted;
};
export { shapeArticle };
//# sourceMappingURL=shapeArticle.js.map