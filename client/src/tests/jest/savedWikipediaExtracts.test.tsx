import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { SavedExtractSchemaType } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import TermListItem from "../../components/React/features/dashboard/Content/SavedInvestigations/Details/wiki/components/extract/items/TermListItem";
import { SavedWikiDescription } from "../../components/React/features/dashboard/Content/SavedInvestigations/Details/wiki/components/extract/descriptions/SavedWikiDescription";

const common = { id: "extract-1", user_id: "user-1", investigation_id: 1, title: "Term", pageUrl: "https://en.wikipedia.org/wiki/Term", lastUpdated: null };
const summary: SavedExtractSchemaType = { ...common, kind: "summary", extract: "Saved summary text", description: "Description", thumbnail: null };
const disambiguation: SavedExtractSchemaType = { ...common, kind: "disambiguation", candidates: [
  { pageid: 1, title: "First meaning", extract: "First definition", thumbnail: null, url: "https://en.wikipedia.org/wiki/First", lastUpdated: null },
  { pageid: 2, title: "Second meaning", extract: "Second definition", thumbnail: null, url: "https://en.wikipedia.org/wiki/Second", lastUpdated: null },
] };

test("summary cards render their text without candidate navigation", () => {
  const html = renderToStaticMarkup(<TermListItem extract={summary} index={0} numItems={1} />);
  expect(html).toContain("Saved summary text");
  expect(html).not.toContain("<button");
});

test("disambiguation cards show candidate zero immediately with navigation", () => {
  const html = renderToStaticMarkup(<TermListItem extract={disambiguation} index={0} numItems={1} />);
  expect(html).toContain("First definition");
  expect(html).toContain("First meaning");
  expect(html).toContain("<button");
});

test("candidate selection renders the requested definition", () => {
  const html = renderToStaticMarkup(<SavedWikiDescription extract={disambiguation} page={1} />);
  expect(html).toContain("Second definition");
  expect(html).not.toContain("First definition");
});

test("empty candidate lists render a fallback without navigation", () => {
  const html = renderToStaticMarkup(<TermListItem extract={{ ...disambiguation, candidates: [] }} index={0} numItems={1} />);
  expect(html).toContain("No candidate definitions were saved.");
  expect(html).not.toContain("<button");
});
