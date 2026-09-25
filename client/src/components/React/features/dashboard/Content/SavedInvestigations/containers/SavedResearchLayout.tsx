import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import ResearchScroller from "./ResearchScroller";
import AsyncStateRenderer from "../../../../../pipelines/AsyncStateRenderer";
import InvestigationsFallback from "../fallbacks/InvestigationsFallback";

export default function SavedResearchLayout() {
  const savedInvestigations = useSelector(
    (state: RootState) => state.dash.investigations,
  );

  return (
    <section key="savedResearch" className="w-full">
      <div className="max-h-screen w-full">
        <AsyncStateRenderer
          state={savedInvestigations}
          empty={() => <InvestigationsFallback />}
        >
          {(state) => <ResearchScroller timeline={state} />}
        </AsyncStateRenderer>
      </div>
    </section>
  );
}
