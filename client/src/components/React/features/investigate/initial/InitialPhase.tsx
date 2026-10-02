import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RenderInitialPhase from "../switches/renderInitialPhase";

function InitialPhase() {
  const state = useSelector(
    (s: RootState) => s.investigation.research.research,
  );

  if (state.phase !== "initial") return null;

  return (
    <div id="initial-phase-container" className="mx-auto">
      <RenderInitialPhase state={state} />
    </div>
  );
}

export default InitialPhase;
