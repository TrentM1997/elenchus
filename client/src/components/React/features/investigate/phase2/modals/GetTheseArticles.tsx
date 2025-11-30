import { runFirecrawlExtraction } from "@/ReduxToolKit/Reducers/Investigate/Reading"
import { useAppdispatch } from "@/hooks/appDispatch"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import DisplayThese from "./DisplayThese"
import { ChosenArticleSlice } from "@/ReduxToolKit/Reducers/Investigate/ChosenArticles";
import { wait } from "@/helpers/Presentation"
import { changePhase } from "@/ReduxToolKit/Reducers/Investigate/Rendering"
import { renderModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice"

export function GetTheseArticles(): JSX.Element {
    const { chosenArticles }: ChosenArticleSlice = useSelector((state: RootState) => state.investigation.getArticle);
    const appDispatch = useAppdispatch();
    const dispatch = useDispatch();

    const retrieveArticles = (): void => {
        appDispatch(runFirecrawlExtraction({ articles: chosenArticles }));
    };

    const executeExtraction = async () => {
        retrieveArticles();
        await wait(200);
        dispatch(changePhase('Phase 3'))
        await wait(200);
        dispatch(renderModal(null));
    };

    const dontExecute = () => {
        dispatch(renderModal(null))
    };

    return (

        <div
            aria-label="Extract the chosen articles modal"
            className="opacity-0 animate-fade-blur animation-delay-700ms will-change-[opacity] ease-soft flex 
            flex-col items-center gap-6 rounded-3xl p-2 md:p-8 lg:p-4 w-88 sm:w-11/12 lg:w-3/4 
            relative  xl:w-5/6 2xl:max-w-6xl h-auto
     sm:gap-y-10 sm:p-10 bg-rich_black ring-2 ring-white/15 mt-2 
     shadow-material text-center">
            <div className="mx-auto flex flex-col gap-y-2 
            lg:gap-y-12 w-full items-end h-full"
            >
                <GetArticlesHeader />
                {(Array.isArray(chosenArticles))
                    && (chosenArticles.length > 0)
                    && <DisplayThese />}
                <ExtractThese executeExtraction={executeExtraction} dontExecute={dontExecute} />
            </div>
        </div>
    );
};


interface ExtractThese {
    executeExtraction: () => Promise<void>,
    dontExecute: () => void
}

function ExtractThese({ executeExtraction, dontExecute }: ExtractThese): JSX.Element {


    return (
        <div className="flex gap-x-2 py-4 items-center justify-center h-full w-full">
            <button onClick={executeExtraction} type="button"
                className="text-base min-w-36 md:w-52 py-2 px-4 rounded-full shadow-material 
                 bg-white hover:bg-white/15 text-black duration-200 
                    hover:text-white inline-flex items-center justify-center">
                Yes
            </button>
            <button onClick={dontExecute} type="button"
                className="text-base py-2 min-w-36 md:w-52 px-4 rounded-full shadow-material
                     bg-white hover:bg-white/15 text-black duration-200 
                     hover:text-white inline-flex items-center justify-center">
                No
            </button>

        </div>
    )
};


function GetArticlesHeader(): JSX.Element {

    return (
        <header className="w-full flex justify-center h-auto"
        >
            <h1 className="text-white text-lg xl:text-3xl font-light 
                    tracking-tight text-center py-2 w-full"
            >Get these articles?</h1>
        </header>
    );
};