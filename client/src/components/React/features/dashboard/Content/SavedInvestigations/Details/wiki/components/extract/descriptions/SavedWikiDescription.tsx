import type { SavedExtractSchemaType } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import DisambigSaved from "../disambig/DisambigSaved";

interface SavedWikiDescriptionProps {
  extract: SavedExtractSchemaType;
  page: number;
}

export function SavedWikiDescription({ extract, page }: SavedWikiDescriptionProps) {
  return (
    <div className="h-52 w-full border-b border-white/20 mt-4 overflow-y-auto relative no-scrollbar">
      {extract.kind === "disambiguation" ? (
        <DisambigSaved page={page} terms={extract.candidates} />
      ) : (
        <p className="text-xs 2xl:text-sm font-light mt-2 text-zinc-300">
          {extract.extract}
        </p>
      )}
    </div>
  );
}
