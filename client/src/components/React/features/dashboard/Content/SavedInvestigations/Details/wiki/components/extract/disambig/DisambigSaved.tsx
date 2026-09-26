import type { WikiDisambigResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

export interface SavedDisambig {
  terms: WikiDisambigResponseSchemaType["candidates"];
  page: number;
}

export default function DisambigSaved({ terms, page }: SavedDisambig) {
  const candidate = terms[page] ?? terms[0];
  if (!candidate) {
    return <p className="text-sm text-zinc-400">No candidate definitions were saved.</p>;
  }
  return (
    <article className="text-sm text-zinc-300">
      <a href={candidate.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        {candidate.title}
      </a>
      <p className="mt-2 font-light">{candidate.extract}</p>
    </article>
  );
}
