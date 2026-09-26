import { useState } from "react";
import { SavedWikiDescription } from "../descriptions/SavedWikiDescription";
import NavCandidates from "@/components/React/features/wiki/components/disambig/buttons/NavDisambig";
import type { SavedExtractSchemaType } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";

interface TermListItemProps {
  index: number;
  extract: SavedExtractSchemaType;
  numItems: number;
}

export default function TermListItem({
  index,
  extract,
  numItems,
}: TermListItemProps) {
  const [page, setPage] = useState<number>(0);

  const snapPoint = index % 4 === 0 ? "snapPoint" : null;

  const widthClass =
    numItems && numItems < 2
      ? "lg:w-60"
      : numItems === 2
        ? "lg:w-[calc((100%-0.75rem)/4)]"
        : numItems === 3
          ? "lg:w-[calc((100%-1.5rem)/3)]"
          : "lg:w-[calc((100%-3rem)/4)]";

  return (
    <li
      data-value={snapPoint}
      className={`w-full sm:w-[calc((100%-2rem)/2)] ${widthClass} bg-ebony shadow-inset rounded-3xl p-4 grow-0 shrink-0`}
    >
      <figure>
        <div className="pb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-circle-check text-white"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
          <p className="font-medium leading-6 text-white mt-6">
            {extract?.title}
          </p>
          <SavedWikiDescription
            page={page}
            extract={extract}
          />
        </div>
      </figure>

      {extract.kind === "disambiguation" && (
        <NavCandidates setPage={setPage} candidates={extract.candidates} page={page} />
      )}
    </li>
  );
}


