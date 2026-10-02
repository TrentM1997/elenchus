import { assertNever } from "@/lib/helpers/asserts/assertNever";
import {
  NotesWritten,
  WrittenNote,
} from "@/state/Reducers/Investigate/articles/NoteTaking";
import NoteTab from "../components/NoteTab";

export default function RenderNoteTabs({
  notes,
  handleClick,
  activeNoteId,
}: {
  notes: NotesWritten;
  handleClick: (note: WrittenNote) => void;
  activeNoteId?: string;
}) {
  switch (notes.status) {
    case "none": {
      return null;
    }
    case "populated": {
      return notes.data.map((note, index) => (
        <NoteTab
          key={note.noteId}
          index={index}
          note={note}
          handleClick={handleClick}
          activeNoteId={activeNoteId}
        />
      ));
    }

    default: {
      return assertNever(notes);
    }
  }
}
