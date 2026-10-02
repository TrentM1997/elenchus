import EmptyState from "@/components/React/global/fallbacks/EmptyState";
import type { InvestigationNotesProps } from "./YourNotes";
import NotesWritten from "./NotesWritten";

export default function RenderInvestigationNotes({
  notes,
}: InvestigationNotesProps) {
  if (!notes?.length) {
    return (
      <EmptyState title="No saved notes" message="No notes were written during this investigation." />
    );
  }

  return <NotesWritten notes={notes} />;
}
