import type { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { renderWorkSpaceHeader } from "../../switches/renderWorkspaceHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";


export default function WorkspaceHeaders() {
    const phase: UserResearchType["phase"] = useSelector((s: RootState) => s.investigation.research.research.phase);

    return renderWorkSpaceHeader(phase);
};
