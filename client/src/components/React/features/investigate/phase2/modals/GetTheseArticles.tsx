import DisplayThese from "./DisplayThese";
import ExtractThese, { GetArticlesHeader } from "./ExtractThese";
import { useExtractTheseArticles } from "@/lib/hooks/articles/useExtractTheseArticles";

export function GetTheseArticles(): JSX.Element {
  const { status, executeExtraction, dontExecute } = useExtractTheseArticles();

  return (
    <div
      aria-label="Extract the chosen articles modal"
      className="flex
            flex-col items-center gap-6 rounded-3xl p-2 md:p-8 lg:p-4 w-88 sm:w-11/12 lg:w-3/4 
            relative  xl:w-5/6 2xl:max-w-6xl h-auto
     sm:gap-y-10 sm:p-10 bg-rich_black ring-2 ring-white/15 mt-2
     shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_60px_-10px_rgba(0,0,0,0.85)] text-center"
    >
      <div
        className="mx-auto flex flex-col gap-y-2 
            lg:gap-y-12 w-full items-end h-full"
      >
        <GetArticlesHeader />
        {status !== "empty" && <DisplayThese />}
        <ExtractThese
          executeExtraction={executeExtraction}
          dontExecute={dontExecute}
        />
      </div>
    </div>
  );
}
