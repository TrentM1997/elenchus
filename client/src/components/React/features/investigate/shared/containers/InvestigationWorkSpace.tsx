import { RootState } from '@/ReduxToolKit/store';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Content from '@/components/React/features/investigate/shared/containers/Content';
import Notes from '@/components/React/features/investigate/notes/Notes';
import { useNoteConstraints } from '@/hooks/useNoteConstraints';
import Headers from './Headers';

export default function InvestigationWorkSpace() {
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);
    const { constraints, notePosition, setNotePosition, notesRef, containerRef } = useNoteConstraints();

    return (
        <section
            ref={containerRef}
            id='workspace'
            className={`w-dvw h-full min-h-screen flex flex-col grow
            justify-start items-center transition-opacity duration-200 relative
            `}
        >
            <AnimatePresence>
                {takingNotes && constraints &&
                    <Notes
                        key={'notepad'}
                        notesRef={notesRef}
                        constraints={constraints}
                        notePosition={notePosition}
                        setNotePosition={setNotePosition}
                    />
                }
            </AnimatePresence>
            <Headers />
            <Content />
        </section>
    );
};