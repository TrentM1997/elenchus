import { TermList } from "./TermList";
import { InvestigationExtracts } from "@/state/Reducers/Dashboard/types";

export function Terms({
  extracts,
}: {
  extracts: InvestigationExtracts;
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
        <TermList extracts={extracts} excess={extracts.length > 4} />
      </div>
    </section>
  );
}
