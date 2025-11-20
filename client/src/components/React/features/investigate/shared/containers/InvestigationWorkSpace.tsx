import { RootState } from '@/ReduxToolKit/store';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import Content from '@/components/React/features/investigate/shared/containers/Content';
import Notes from '@/components/React/features/investigate/notes/Notes';
import type { Phase } from '@/ReduxToolKit/Reducers/Investigate/Rendering';
import { renderWorkSpaceHeader } from '../../switches/renderWorkspaceHeader';
import { useNoteConstraints } from '@/hooks/useNoteConstraints';

export default function InvestigationWorkSpace() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
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

            {renderWorkSpaceHeader(phase)}
            <Content />

        </section>
    );
};