const isContentInvalid = (c) => {
    return (!c
        || typeof c.content_markdown !== "string"
        || c.content_markdown.trim().length < 100);
};
export { isContentInvalid };
//# sourceMappingURL=isContentInvalid.js.map