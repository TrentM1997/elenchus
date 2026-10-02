import type { OpenedResearchState } from "@/state/Reducers/Dashboard/types";
import { useId } from "react";
import RenderInvestigationNotes from "./RenderInvestigationNotes";

export type InvestigationNotesProps = {
  notes: Extract<OpenedResearchState, { status: "ready" }>["data"]["notes"];
};

export default function InvestigationNotes({ notes }: InvestigationNotesProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="w-full min-w-0 max-w-2xl px-4 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-blue-400">During your investigation</p>
          <h2 id={headingId} className="mt-3 text-3xl font-light tracking-tight text-white lg:text-4xl">Your notes</h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-zinc-400">Observations and questions you captured while exploring the evidence.</p>
        </div>
        {!!notes?.length && (
          <span className="mt-1 shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs tabular-nums text-zinc-400">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        )}
      </header>
      <RenderInvestigationNotes notes={notes} />
    </section>
  );
}
