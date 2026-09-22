import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import DisplayThese from "./DisplayThese";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { extractArticles } from "@/state/Reducers/Investigate/articles/thunks";
import ExtractThese, { GetArticlesHeader } from "./ExtractThese";

export function GetTheseArticles(): JSX.Element {
  const { selected } = useSelector(
    (state: RootState) => state.investigation.getArticle,
  );
  const dispatch = useDispatch<AppDispatch>();
  const retrieveArticles = (): void => {
    if (selected.status !== "empty") {
      dispatch(extractArticles(selected.data.map(article => ({
        url: article.url,
        source: article.provider,
        date: article.date_published,
        logo: article.logo,
        title: article.name,
        image: article.image ?? "",
        description: article.description,
      }))));
    }
  };

  const executeExtraction = async () => {
    if (selected.status === "empty" || selected.data.length === 0) return;
    retrieveArticles();
    await wait(400);
    dispatch(renderModal(null));
  };

  const dontExecute = (e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(renderModal(null));
  };

  return (
    <div
      aria-label="Extract the chosen articles modal"
      className="opacity-0 animate-fade-blur animation-delay-700ms will-change-[opacity] ease-soft flex 
            flex-col items-center gap-6 rounded-3xl p-2 md:p-8 lg:p-4 w-88 sm:w-11/12 lg:w-3/4 
            relative  xl:w-5/6 2xl:max-w-6xl h-auto
     sm:gap-y-10 sm:p-10 bg-rich_black ring-2 ring-white/15 mt-2 backdrop-blur-xl
     shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_60px_-10px_rgba(0,0,0,0.85)] text-center"
    >
      <div
        className="mx-auto flex flex-col gap-y-2 
            lg:gap-y-12 w-full items-end h-full"
      >
        <GetArticlesHeader />
        {selected.status !== "empty" && <DisplayThese />}
        <ExtractThese
          executeExtraction={executeExtraction}
          dontExecute={dontExecute}
        />
      </div>
    </div>
  );
}

interface ExtractThese {
  executeExtraction: () => Promise<void>;
  dontExecute: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

