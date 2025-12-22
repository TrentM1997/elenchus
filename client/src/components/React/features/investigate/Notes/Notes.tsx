import { motion } from "framer-motion"
import { RootState } from "@/state/store"
import { useDispatch, useSelector } from "react-redux"
import { writingNote, saveNote } from "@/state/Reducers/Investigate/NoteTaking"
import NotesEditor from "@/components/React/global/TipTap/NotesEditor";
import type { NotePosition } from "@/hooks/useNoteConstraints"

export default function Notes({ notePosition, setNotePosition, constraints, notesRef }) {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { notes } = investigateState
    const { noteTaken } = notes
    const dispatch = useDispatch()

    //TODO: solve framer-motion bug with drag constraints, not accounting for passed constraints object for whatever reason 

    return (
        <motion.div
            layout
            ref={notesRef}
            drag
            dragConstraints={constraints}
            dragMomentum={false}
            onDragEnd={(_, info) => {
                setNotePosition((prev: NotePosition) => ({
                    x: prev.x + info.delta.x,
                    y: prev.y + info.delta.y
                }))
            }}
            style={{ position: 'absolute' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: notePosition.x, y: notePosition.y }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-mirage z-50 2xl:w-[29rem] 2xl:h-96 xs:h-60 xs:w-72
            shadow-thick rounded-lg inset cursor-pointer
            flex flex-col overflow-hidden">
            <div className="h-full w-full box-border flex flex-col justify-start">
                <div className="w-full max-h-fit flex justify-end rounded-t-lg">
                    <div
                        onClick={() => dispatch(writingNote())}
                        className="max-w-8 max-h-8 p-1.5 box-border hover:bg-white/20 transition-all duration-200 ease-in-out">
                        <svg className="text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                            <path d="M 7 22 A 2.0002 2.0002 0 1 0 7 26 L 41 26 A 2.0002 2.0002 0 1 0 41 22 L 7 22 z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
                <div className=" h-full w-full pb-1 mx-auto bg-mirage rounded-b-md">
                    <NotesEditor context={noteTaken} setterFunction={saveNote} />
                </div>

            </div>

        </motion.div>
    )



}