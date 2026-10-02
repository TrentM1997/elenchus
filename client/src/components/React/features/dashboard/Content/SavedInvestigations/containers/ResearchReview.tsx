import { useSelector, useDispatch } from "react-redux";
import { SourcesFromResearch } from "../Details/sources/SourcesUsed";
import DetailsTable from "../Details/DetailsTable";
import DetailsTableSkeleton from "../Details/DetailsTableSkeleton";
import WikipediaTerms from "../Details/wiki/containers/WikipediaTerms";
import WikipediaTermsSkeleton from "../Details/wiki/containers/WikipediaTermsSkeleton";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import { ScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import { useHydrateOpenedInvestigation } from "@/lib/hooks/useHydrateOpenedInvestigaton";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { RootState } from "@/state/store";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import ResearchSourceSkeleton from "../Details/sources/ResearchSourceSkeleton";
import React from "react";
import InvestigationNotes from "../notes/YourNotes";

export default function ResearchReview({
  investigationId,
}: {
  investigationId: InvestigationSchemaType["id"];
}) {
  useHydrateOpenedInvestigation(investigationId);
  const investigation = useSelector((s: RootState) => s.dash.openInvestigation);
  const dispatch = useDispatch();

  const backTo = (): void => {
    dispatch(changeTab({ kind: "investigations", display: "main" }));
    ScrollUp();
  };

  return (
    <section
      className="h-full min-h-dvh w-full opacity-0
          animate-fade-blur animation-delay-200ms"
    >
      <DetailView backTo={backTo} />
      <div
        className="w-full h-full pb-20 overscroll-contain overflow-y-scroll 
      no-scrollbar grow flex flex-col gap-y-24 items-center justify-start"
      >
        <AsyncStateRenderer
          state={investigation}
          pending={() => (
            <React.Fragment>
              <DetailsTableSkeleton />
              <ResearchSourceSkeleton />
              <WikipediaTermsSkeleton />
            </React.Fragment>
          )}
        >
          {(state) => (
            <React.Fragment>
              <DetailsTable investigation={state.investigation} />
              <InvestigationNotes notes={state.notes} />
              <SourcesFromResearch sources={state.sources} />
              <WikipediaTerms extracts={state.extracts} />
            </React.Fragment>
          )}
        </AsyncStateRenderer>
      </div>
    </section>
  );
}
