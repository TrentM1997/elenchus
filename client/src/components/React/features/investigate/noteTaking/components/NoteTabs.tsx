import {
  NotesWritten,
  openWrittenNote,
  WrittenNote,
} from "@/state/Reducers/Investigate/articles/NoteTaking";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";
import RenderNoteTabs from "../rendering/RenderNoteTabs";

export default function NoteTabs({
  notes,
  activeNoteId,
}: {
  notes: NotesWritten;
  activeNoteId?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = (note: WrittenNote) => {
    dispatch(openWrittenNote(note));
  };

  return (
    <section className="bg-mirage w-full">
      <div className="flex items-center justify-start gap-0.5 overflow-x-auto w-auto ">
        <RenderNoteTabs
          notes={notes}
          handleClick={handleClick}
          activeNoteId={activeNoteId}
        />
      </div>
    </section>
  );
}
