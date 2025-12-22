import { RootState } from "@/state/store"
import { useSelector } from "react-redux"
import type { Extracts } from "@/state/Reducers/Investigate/Review";
import { TermList } from "./TermList";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import NoSavedExtracts from "../fallbacks/NoSavedExtracts";

export interface TermsTypes {
  wikipedia_extracts: Extracts[],
  excess: boolean | null
}

export function Terms(): JSX.Element | null {
  const research = useSelector((state: RootState) => state.userWork.investigationToReview);
  const { wikipedia_extracts } = research;
  const excess: boolean | null = wikipedia_extracts ? wikipedia_extracts.length > 4 : null;

  return (
    <section className="w-full lg:max-w-5xl xl:max-w-5xl 2xl:max-w-7xl">
      <div className="mx-auto py-12 px-4 items-center w-full">
        <div>
          <span className="text-blue-400">From Wikipedia</span>
          <h2 className="text-3xl tracking-tight mt-6 font-light lg:text-4xl text-white">
            Unfamilar Terms <span className="md:block text-zinc-400">extracted for context</span>
          </h2>
          <p className="mt-4 text-base text-white max-w-md">
            Here are the terms you looked up from within your articles while immersed in research
          </p>
        </div>
        <ErrorBoundary>
          {Array.isArray(wikipedia_extracts) && (wikipedia_extracts.length > 0)
            ? <TermList wikipedia_extracts={wikipedia_extracts} excess={excess} />
            : <NoSavedExtracts />
          }
        </ErrorBoundary>
      </div>
    </section>
  );
};