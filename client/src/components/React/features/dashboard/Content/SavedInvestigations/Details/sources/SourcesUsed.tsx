import { RootState } from "@/ReduxToolKit/store"
import { useSelector } from "react-redux"
import ErrMessage from "@/components/React/Shared/ErrorBoundaries/messages/ErrMessage"
import ResearchSource from "./ResearchSource"

export function SourcesFromResearch() {
  const sources = useSelector((state: RootState) => state.userWork.sourcesToReview);

  return (<div className="w-full 2xl:max-w-7xl h-auto mx-auto">
    <div className="w-full flex items-center h-fit justify-start">
      <p className="text-blue-400">Sources used</p>
    </div>
    <ol role="list" className="grid gap-12 mt-24 w-full md:max-w-2xl lg:max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto lg:px-0 xl:px-0 md:px-12 px-8">
      {
        Array.isArray(sources) && (sources.length > 0) && sources.map((source) => (
          <ResearchSource
            key={source.id}
            source={source}
          />
        ))
      }

      {(Array.isArray(sources) && (sources.length === 0)) && <h1 className="text-zinc-400 text-xl font-light tracking-tight py-12 text-center">No sources were saved during this research</h1>}

    </ol>
  </div>

  );
};


