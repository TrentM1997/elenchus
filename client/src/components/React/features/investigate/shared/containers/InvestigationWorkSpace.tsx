import Content from "@/components/React/features/investigate/shared/containers/Content";
import { useNoteConstraints } from "@/lib/hooks/rendering/useNoteConstraints";
import WorkspaceHeaders from "./WorkspaceHeaders";
import { RenderNotePad } from "../../noteTaking/rendering/RenderNotePad";
import type { UseNoteConstraintsReturn } from "@/lib/hooks/rendering/useNoteConstraints";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

function InvestigationWorkSpace({ research }: { research: UserResearchType }) {
  const state = useSelector((s: RootState) => s.investigation.notes.current);
  const {
    notePosition,
    setNotePosition,
    notesRef,
    containerRef,
    constraints,
  }: UseNoteConstraintsReturn = useNoteConstraints();

  return (
    <section
      ref={containerRef}
      id="workspace"
      className="w-dvw min-w-full h-full min-h-screen grow transition-opacity duration-200 relative"
    >
      <RenderNotePad
        state={state}
        notePosition={notePosition}
        setNotePosition={setNotePosition}
        notesRef={notesRef}
        constraints={constraints}
      />
      <WorkspaceHeaders />
      <Content research={research} />
    </section>
  );
}

export default InvestigationWorkSpace;
