import { useSelector } from "react-redux";
import type { PathSelected } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { RootState } from "@/ReduxToolKit/store";
import { renderInitialPhase } from "../switches/renderInitialPhase";

function InitialPhase() {
    const path: PathSelected = useSelector((s: RootState) => s.investigation.rendering.path);

    return (
        <div
            id="initial-phase-container"
            className=""
        >
            {renderInitialPhase(path)}
        </div>
    );
};


export default InitialPhase;