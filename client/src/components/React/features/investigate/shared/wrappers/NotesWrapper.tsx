import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";
import type { DragConstraints, NotePosition } from "@/hooks/useNoteConstraints";
import Notes from "../../notes/Notes";
import React, { SetStateAction } from "react";

interface NotesWrapperProps {
    notePosition: NotePosition,
    setNotePosition: React.Dispatch<SetStateAction<NotePosition>>,
    notesRef: React.RefObject<HTMLDivElement | null>
};

function NotesWrapper({ notesRef, notePosition, setNotePosition }: NotesWrapperProps): JSX.Element | null {
    const constraints: DragConstraints = useSelector((s: RootState) => s.investigation.notes.constraints);
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);


    return (
        <AnimatePresence>
            {(takingNotes && constraints) &&
                <Notes
                    key={'notepad'}
                    notesRef={notesRef}
                    constraints={constraints}
                    notePosition={notePosition}
                    setNotePosition={setNotePosition}
                />
            }
        </AnimatePresence>
    )
};


export default NotesWrapper;