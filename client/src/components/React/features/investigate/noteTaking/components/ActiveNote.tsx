import type { TakingNoteState } from "@/state/Reducers/Investigate/articles/NoteTaking";
import { Fragment } from "react/jsx-runtime";
import NotesEditor from "@/components/React/global/TipTap/NotesEditor";

interface ActiveNote {
  note: Extract<TakingNoteState, { status: "draft" } | { status: "open" }>;
}

export default function ActiveNote({ note }: ActiveNote) {
  return (
    <Fragment>
      <NotesEditor current={note} />
    </Fragment>
  );
}
