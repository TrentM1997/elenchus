import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { populateTooltip } from "@/state/Reducers/Investigate/Rendering";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { retrieveChosenArticlesCSS } from "./styles";

export default function RetrieveChosenArticles(): JSX.Element {
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleSummaries = () => {
    if (selected.status !== "empty") {
      dispatch(renderModal("Extract Confirmation"));
    } else {
      dispatch(populateTooltip("Selection Required"));
    }
  };

  return (
    <div>
      <button className={`group`}>
        <div onClick={handleSummaries} className={retrieveChosenArticlesCSS}>
          <div className="w-full">
            <p className="text-black text-sm font-normal sm:text-base md:text-lg group-hover:text-white text-nowrap transition-all duration-200 ease-in-out">
              Retrieve these articles &rarr;
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
