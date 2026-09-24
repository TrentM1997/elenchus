import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import RenderSelectedArticles from "@/components/React/pipelines/RenderSelectedArticles";

export default function DisplayThese() {
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const { onScrollHandler } = useScrollWithShadow();
  if (selected.status === "empty") return null;

  return (
    <div
      aria-label="Chosen articles container"
      className="flex items-center justify-center h-full w-full"
    >
      <div className="relative w-full h-[55dvh] sm:h-full mx-auto">
        <RenderSelectedArticles
          state={selected}
          onScrollHandler={onScrollHandler}
        />
      </div>
    </div>
  );
}
