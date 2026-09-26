import { useSelector, useDispatch } from "react-redux";
import { SourcesFromResearch } from "../Details/sources/SourcesUsed";
import DetailsTable from "../Details/DetailsTable";
import { Terms } from "../Details/wiki/containers/WikipediaTerms";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import { ScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import { useHydrateOpenedInvestigation } from "@/lib/hooks/useHydrateOpenedInvestigaton";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { RootState } from "@/state/store";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";

export default function ResearchReview({
  investigationId,
}: {
  investigationId: InvestigationSchemaType["id"];
}) {
  useHydrateOpenedInvestigation(investigationId);
  const investigation = useSelector(
    (s: RootState) => s.dash.openInvestigation.investigation,
  );
  const sources = useSelector(
    (s: RootState) => s.dash.openInvestigation.sources,
  );
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
      <AsyncStateRenderer state={investigation}>
        {(state) => (
          <div className="w-full h-full pb-20 overscroll-contain overflow-y-scroll no-scrollbar grow flex flex-col gap-y-24 items-center justify-start">
            <ErrorBoundary>
              <DetailsTable investigation={state} />
              <SourcesFromResearch sources={sources} />
              <Terms research={state} />
            </ErrorBoundary>
          </div>
        )}
      </AsyncStateRenderer>
    </section>
  );
}
