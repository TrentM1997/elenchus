import { RootState } from "@/ReduxToolKit/store"
import { useSelector } from "react-redux"
import ErrMessage from "@/components/React/Shared/ErrorBoundaries/messages/ErrMessage"
import ResearchSource from "./ResearchSource"

export function SourcesFromResearch() {
  const sources = useSelector((state: RootState) => state.userWork.sourcesToReview);

  return (
    <ol role="list" className="grid gap-12 mt-24 max-w-7xl w-full mx-auto lg:px-0 xl:px-0 md:px-12 px-8">
      <span className="text-blue-400">Sources used</span>
      {
        Array.isArray(sources) && sources.map((source) => (
          <ResearchSource
            key={source.id}
            source={source}
          />
        ))
      }
      {sources && sources.length < 1 && <ErrMessage message={{ kind: 'parse' }} />}
    </ol>
  );
};


