import Firecrawl from "@mendable/firecrawl-js";

export const schema = {
  type: "object",
  properties: {
    content_markdown: { type: "string" },
  },
  required: ["content_markdown"],
};

export const dropParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
];

export const FIRECRAWL_OPTIONS = {
  onlyMainContent: true,
  blockAds: true,
  maxAge: 31449600000, // 1 year
  waitFor: 1500,
  formats: [
    {
      type: "json",
      schema,
      prompt:
        "Extract ONLY the main article body. Return it as markdown in content_markdown. Preserve paragraph breaks, headings, bullet lists, and quoted passages. Exclude navigation menus, cookie notices, paywall blurbs, newsletter signups, and unrelated promos.",
    },
  ],
} satisfies Parameters<Firecrawl["scrape"]>[1];

export const excluded_tags = [
  // multimedia / ads
  "video",
  "iframe",
  "noscript",
  "embed",
  "object",
  ".ad",
  ".ads",
  ".advertisement",
  ".sponsor",
  ".sponsored",
  ".ad-container",
  ".ad-slot",
  ".promo",
  ".promotion",
  ".affiliate",
  ".outbrain",
  ".taboola",

  // nav / banners / popups / sticky UI
  "nav",
  "footer",
  "header",
  "aside",
  "form",
  ".nav",
  ".banner",
  ".popup",
  ".modal",
  ".overlay",
  ".sticky",
  ".fixed",
  ".floating",
  ".topbar",
  ".bottom-bar",
  ".announcement",

  // social & comments
  ".share",
  ".social",
  ".comments",
  ".comment",
  "#comments",
  ".fb",
  ".twitter",
  ".instagram",
  ".tiktok",
  ".linkedin",
  ".reddit",
  ".follow",
  ".like-button",
  ".share-buttons",

  // cookie and consent
  ".cookie",
  ".cookie-banner",
  ".consent",
  "#consent",
  ".gdpr",
  ".privacy",
  ".disclaimer",

  // recirculation / recommended / related / trending
  ".recommended",
  ".recommendations",
  ".recirc",
  ".related",
  ".related-content",
  ".read-more",
  ".more-stories",
  ".trending",
  ".popular",
  ".you-may-also-like",
  ".more-on",
  ".more-from",
  ".next-article",
  ".previous-article",
  ".sidebar",
  ".right-rail",
  ".left-rail",

  // newsletter / subscription / paywall
  ".newsletter",
  ".subscription",
  ".subscribe",
  ".signup",
  ".paywall",
  ".meter",
  ".login",

  // player wrappers
  ".player-container",
  ".ytp",
  ".jwplayer",
  ".vjs",
  ".audio-player",
  ".media-player",

  ".sponsored-content",
  ".external-links",
  ".widget",
  ".tools",
  ".comments-section",
];
