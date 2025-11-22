import Content from '@/components/React/features/investigate/shared/containers/Content';
import { useNoteConstraints } from '@/hooks/useNoteConstraints';
import WorkspaceHeaders from './WorkspaceHeaders';
import NotesWrapper from '../wrappers/NotesWrapper';
import type { UseNoteConstraintsReturn } from '@/hooks/useNoteConstraints';

function InvestigationWorkSpace() {
    const {
        notePosition,
        setNotePosition,
        notesRef,
        containerRef
    }: UseNoteConstraintsReturn = useNoteConstraints();

    return (
        <section
            ref={containerRef}
            id='workspace'
            className="w-dvw min-w-full h-full min-h-screen grow
           transition-opacity 
            duration-200 relative">
            <NotesWrapper
                notePosition={notePosition}
                setNotePosition={setNotePosition}
                notesRef={notesRef}
            />
            <WorkspaceHeaders />
            <Content />
        </section>
    );
};

export default InvestigationWorkSpace;