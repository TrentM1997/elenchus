import { NotesWritten } from "@/state/Reducers/Investigate/articles/NoteTaking";
import NoteTabs from "../components/NoteTabs";
import CloseNotePadButton from "../components/CloseNotePadButton";

export default function NotePadTopRail({
  writtenNotes,
  activeNoteId,
}: {
  writtenNotes: NotesWritten;
  activeNoteId?: string;
}) {
  return (
    <div className="w-full xl:h-10 max-h-fit flex justify-between items-center overflow-hidden rounded-t-lg">
      <NoteTabs activeNoteId={activeNoteId} notes={writtenNotes} />
      <CloseNotePadButton />
    </div>
  );
}
