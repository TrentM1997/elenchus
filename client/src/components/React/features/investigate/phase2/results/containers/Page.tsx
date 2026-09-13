import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import type { SelectedArticle } from "@/env";
import RenderSearchResults from "@/components/React/pipelines/RenderSearchResults";

interface Page {
  index: number;
  urlHash: Set<string>;
  select: (article: SelectedArticle) => () => void;
}

export default function Page({
  index,
  urlHash,
  select,
}: Page): JSX.Element | null {
  const searchState = useSelector(
    (s: RootState) => s.investigation.search.articleOptions,
  );
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );

  return (
    <ul
      className={`transform-gpu  will-change-[opacity,transform] contain-layout contain-paint overflow-hidden animation-delay-200ms
            relative h-full no-scrollbar py-2 opacity-0 animate-fade-in ease-soft
            w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row lg:gap-y-6 2xl:gap-x-0 gap-2`}
    >
      <RenderSearchResults
        state={searchState}
        selected={selected}
        select={select}
        urlHash={urlHash}
      />
    </ul>
  );
}
