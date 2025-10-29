// sanitizeArticle.ts

// Main entry point.
// Input: raw markdown string from Firecrawl for ONE article.
// Output: cleaned markdown string, safe to store/render.
export function cleanMarkdownArticle(markdown: string): string {
    // 1. Split into logical "blocks" (paragraphs, headings, lists)
    //    We treat 2+ newlines as a boundary.
    const rawBlocks = splitIntoBlocks(markdown);

    const cleanedBlocks: string[] = [];
    let pastArticleBody = false; // once true, we ignore everything else

    for (const block of rawBlocks) {
        const trimmed = block.trim();

        if (!trimmed) continue; // skip empty

        // If we've already decided we've hit the "end of article" marker,
        // we don't keep anything after.
        if (pastArticleBody) {
            continue;
        }

        // Heuristic: detect that we've entered the junk/trailing zone,
        // e.g. "More on this story", "Recommended", etc.
        if (looksLikeEndOfArticle(trimmed)) {
            pastArticleBody = true;
            continue;
        }

        // Now run block-level junk filters
        if (looksLikeNewsletterCTA(trimmed)) continue;
        if (looksLikeShareOrFollow(trimmed)) continue;
        if (looksLikeRelatedLinksBlock(trimmed)) continue;
        if (looksLikeCommentsBlock(trimmed)) continue;
        if (looksLikeNavOrUtilityBlock(trimmed)) continue;

        // Passed all filters: keep it
        cleanedBlocks.push(trimmed);
    }

    // Rejoin with a blank line between blocks so markdown still looks natural
    return cleanedBlocks.join("\n\n");
}

/* --------------------------
   Helpers
--------------------------- */

// Split on 2+ newlines to approximate paragraphs / sections / list blocks.
function splitIntoBlocks(markdown: string): string[] {
    return markdown
        .split(/\n{2,}/g)
        .map(b => b.replace(/\s+$/g, "")); // trim trailing space on each
}

// newsletter / subscription / paywall nags
function looksLikeNewsletterCTA(block: string): boolean {
    const lower = block.toLowerCase();

    // common phrases that are almost never part of the article body
    const killers = [
        "sign up for our newsletter",
        "sign up for the newsletter",
        "sign up for our daily newsletter",
        "sign up for our daily briefing",
        "subscribe to our newsletter",
        "subscribe to get unlimited access",
        "subscribe for unlimited access",
        "get unlimited access",
        "get full access",
        "to continue reading",
        "get the latest updates delivered to your inbox",
        "join now to continue",
        "become a subscriber",
        "already a subscriber",
        "log in to continue",
        "create an account to read more",
        "support our journalism"
    ];

    return killers.some(k => lower.includes(k));
}

// social/share/follow junk
function looksLikeShareOrFollow(block: string): boolean {
    const lower = block.toLowerCase();

    // We treat any "follow us on X/FB/etc" as junk.
    if (
        lower.includes("follow us on") ||
        lower.includes("follow ") && (
            lower.includes("twitter") ||
            lower.includes("x.com") ||
            lower.includes("facebook") ||
            lower.includes("instagram") ||
            lower.includes("tiktok") ||
            lower.includes("linkedin") ||
            lower.includes("reddit")
        )
    ) {
        return true;
    }

    // share prompts
    if (
        lower.includes("share this article") ||
        lower.includes("share this story") ||
        lower.includes("share on twitter") ||
        lower.includes("share on x") ||
        lower.includes("share on facebook") ||
        lower.includes("share on linkedin")
    ) {
        return true;
    }

    return false;
}

// blocks that are basically "Related:" / "Read more:" / link dumps
function looksLikeRelatedLinksBlock(block: string): boolean {
    const lower = block.toLowerCase();

    // If the block starts like "related:" or "read more:" etc,
    // very high chance it's not body content.
    const startsLikeLinkHub = /^(related|read more|more on|more from|recommended|trending|you may also like|also read|more stories|more coverage|further reading)\b/i;
    if (startsLikeLinkHub.test(block)) return true;

    // Heuristic: block that is basically just a bunch of markdown links / bullets
    // e.g.
    // - [Why housing is broken](https://...)
    // - [The Fed's next step](https://...)
    const lines = block.split("\n");
    const linkyLines = lines.filter(l =>
        /^\s*[-*+]\s*\[.+?\]\(.+?\)/.test(l.trim()) ||       // bullet markdown links
        /^\s*\[.+?\]\(.+?\)\s*$/.test(l.trim()) ||           // bare link lines
        /https?:\/\/\S+/.test(l.trim())                      // raw URLs
    );

    // If majority of lines in this block are link-only, it's a link dump.
    if (lines.length > 0 && linkyLines.length / lines.length >= 0.6) {
        return true;
    }

    return false;
}

// comments / discussion bait
function looksLikeCommentsBlock(block: string): boolean {
    const lower = block.toLowerCase();

    if (
        lower.includes("leave a comment") ||
        lower.includes("leave your comment") ||
        lower.includes("add your comment") ||
        lower.includes("join the discussion") ||
        lower.includes("join the conversation") ||
        lower.includes("view comments") ||
        lower.includes("view all comments") ||
        lower.includes("0 comments") || // "0 Comments" / "12 Comments"
        /\b\d+\s+comments\b/.test(lower)
    ) {
        return true;
    }

    return false;
}

// site nav junk that sneaks in as text (like "Home / Politics / Economy")
function looksLikeNavOrUtilityBlock(block: string): boolean {
    const lower = block.toLowerCase();

    // breadcrumb-y / section nav style:
    // "Home / World / Business / Markets"
    if (
        /home\s*\/\s*\w+/.test(lower) &&
        /\/\s*\w+/.test(lower)
    ) {
        return true;
    }

    // super short "Tools / Print / Email" style utility bars
    const words = block.trim().split(/\s+/);
    if (
        words.length <= 8 &&
        (
            lower.includes("print") ||
            lower.includes("email") ||
            lower.includes("listen") ||
            lower.includes("audio") ||
            lower.includes("save") ||
            lower.includes("gift this article") ||
            lower.includes("give this article")
        )
    ) {
        return true;
    }

    return false;
}

// marks the point where we consider the actual article "over"
// After we see this, we drop this block AND everything after it.
function looksLikeEndOfArticle(block: string): boolean {
    const lower = block.toLowerCase();

    // These usually kick off the "More from [Site]" / "Recommended for you" zone.
    const enders = [
        "more from",
        "more stories",
        "more coverage",
        "recommended for you",
        "you may also like",
        "trending",
        "in case you missed it",
        "around the web",
        "sponsored content",
        "paid content",
        "the latest headlines",
        "read more:"
    ];

    // Starts with one of those? We treat that as "we're done".
    return enders.some(start => lower.startsWith(start));
}
