import Content from "@/components/React/features/investigate/shared/containers/Content";
import { useNoteConstraints } from "@/lib/hooks/rendering/useNoteConstraints";
import WorkspaceHeaders from "./WorkspaceHeaders";
import NotesWrapper from "../wrappers/NotesWrapper";
import type { UseNoteConstraintsReturn } from "@/lib/hooks/rendering/useNoteConstraints";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";

function InvestigationWorkSpace({ research }: { research: UserResearchType }) {
  const {
    notePosition,
    setNotePosition,
    notesRef,
    containerRef,
  }: UseNoteConstraintsReturn = useNoteConstraints();

  return (
    <section
      ref={containerRef}
      id="workspace"
      className="w-dvw min-w-full h-full min-h-screen grow transition-opacity duration-200 relative"
    >
      <NotesWrapper
        notePosition={notePosition}
        setNotePosition={setNotePosition}
        notesRef={notesRef}
      />
      <WorkspaceHeaders />
      <Content research={research} />
    </section>
  );
}

export default InvestigationWorkSpace;
