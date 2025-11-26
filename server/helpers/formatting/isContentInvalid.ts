import type { FirecrawlContent } from "../../types/types";

const isContentInvalid = (c: FirecrawlContent | null | undefined): boolean => {
    return (
        !c
        || typeof c.content_markdown !== "string"
        || c.content_markdown.trim().length < 100
    );
};


export { isContentInvalid };