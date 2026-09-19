import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import RenderSearchResults from "@/components/React/pipelines/RenderSearchResults";
import { searchResultListCSS } from "./styles";
import type { Page } from "./types";

export default function PageContainer({
  urlHash,
  select,
}: Page): JSX.Element | null {
  const searchState = useSelector(
    (s: RootState) => s.investigation.search.pages,
  );
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );

  return (
    <div className="relative min-h-full grow w-full h-full contain-layout contain-paint">
      <ul className={searchResultListCSS}>
        <RenderSearchResults
          state={searchState}
          selected={selected}
          select={select}
          urlHash={urlHash}
        />
      </ul>
    </div>
  );
}
