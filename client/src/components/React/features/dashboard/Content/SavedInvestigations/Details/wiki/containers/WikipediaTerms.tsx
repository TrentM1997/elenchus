import NoSavedExtracts from "../fallbacks/NoSavedExtracts";
import { TermList } from "./TermList";
import { OpenInvestigationExtracts } from "@/state/Reducers/Dashboard/types";
import FailedState from "@/components/React/global/fallbacks/FailedState";
import PendingState from "@/components/React/global/fallbacks/PendingState";

export function Terms({
  extracts,
}: {
  extracts: OpenInvestigationExtracts;
}): JSX.Element | null {
  return (
    <section className="w-full lg:max-w-5xl xl:max-w-5xl 2xl:max-w-7xl">
      <div className="mx-auto py-12 px-4 items-center w-full">
        <div>
          <span className="text-blue-400">From Wikipedia</span>
          <h2 className="text-3xl tracking-tight mt-6 font-light lg:text-4xl text-white">
            Unfamiliar Terms{" "}
            <span className="md:block text-zinc-400">
              extracted for context
            </span>
          </h2>
          <p className="mt-4 text-base text-white max-w-md">
            Here are the terms you looked up from within your articles while
            immersed in research
          </p>
        </div>
        <RenderSavedWikipediaExtracts extracts={extracts} />
      </div>
    </section>
  );
}

function RenderSavedWikipediaExtracts({
  extracts,
}: {
  extracts: OpenInvestigationExtracts;
}) {
  switch (extracts.status) {
    case "initial":
      return null;
    case "pending": {
      return <PendingState />;
    }
    case "failed": {
      return <FailedState />;
    }
    case "empty": {
      return <NoSavedExtracts />;
    }
    case "ready": {
      if (extracts.data.length === 0) return <NoSavedExtracts />;
      return (
        <TermList extracts={extracts.data} excess={extracts.data.length > 4} />
      );
    }
  }
}
