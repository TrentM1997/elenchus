import type { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { renderWorkSpaceHeader } from "../../switches/renderWorkspaceHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";


export default function WorkspaceHeaders() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);

    return renderWorkSpaceHeader(phase);
};