import { updateResearchNotes } from "@/state/Reducers/Investigate/research/ResearchSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";

export const usePushWrittenNotesToResearch = () => {
  const notes = useSelector(
    (s: RootState) => s.investigation.notes.notesWritten,
  );
  const dispatch = useDispatch<AppDispatch>();

  const pushNotes = () => {
    const noteContents =
      notes.status === "none"
        ? undefined
        : notes.data.map((note) => {
            return { content: note.content };
          });

    if (noteContents) dispatch(updateResearchNotes(noteContents));
  };

  return {
    pushNotes,
  };
};
