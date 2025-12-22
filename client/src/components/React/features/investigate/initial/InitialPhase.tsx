import { useSelector } from "react-redux";
import type { PathSelected } from "@/state/Reducers/Investigate/Rendering";
import { RootState } from "@/state/store";
import { renderInitialPhase } from "../switches/renderInitialPhase";

function InitialPhase() {
    const path: PathSelected = useSelector((s: RootState) => s.investigation.rendering.path);

    return (
        <div
            id="initial-phase-container"
            className="mx-auto"
        >
            {renderInitialPhase(path)}
        </div>
    );
};


export default InitialPhase;