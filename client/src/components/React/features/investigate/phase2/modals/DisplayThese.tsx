import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { discard } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import RenderSelectedArticles from "@/components/React/pipelines/RenderSelectedArticles";

export default function DisplayThese() {
  const dispatch = useDispatch<AppDispatch>();
  const investigateState = useSelector(
    (state: RootState) => state.investigation,
  );
  const { selected } = investigateState.getArticle;
  const { boxShadow, onScrollHandler } = useScrollWithShadow();
  const isMobile = useIsMobile();

  const chooseArticle = useCallback((article: SelectedArticle) => {
    return () => {
      dispatch(discard(article.url));
    };
  }, []);

  return (
    <div
      aria-label="Chosen articles container"
      className="flex items-center justify-center h-full w-full opacity-0 
                animate-fade-clip animation-delay-700ms ease-soft"
    >
      <div className="relative w-full h-[55dvh] sm:h-full mx-auto">
        <RenderSelectedArticles
          state={selected}
          chooseArticle={chooseArticle}
          onScrollHandler={onScrollHandler}
        />
      </div>
    </div>
  );
}

//const MOBILE_SHADOW: CSSProperties["boxShadow"] | null = isMobile
//  ? { boxShadow: boxShadow }
//  : null;c
