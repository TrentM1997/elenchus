import { useDispatch } from "react-redux"
import { presentArticles, presentThisInvestigation } from "@/ReduxToolKit/Reducers/UserContent.ts/ProfileNavigationSlice";

interface Contexts {
    articlesContext: boolean,
}

export default function BackToSavedArticles({ articlesContext }: Contexts) {
    const dispatch = useDispatch();



    const backToSaved = (fromArticles: boolean) => {
        if (fromArticles) {
            dispatch(presentArticles());
        } else {
            dispatch(presentThisInvestigation());
        }
    };


    return (
        <button onClick={() => { backToSaved(articlesContext) }} className="absolute z-50 md:z-1 top-3 left-0 md:left-0 lg:left-1.5 xl:left-2 2xl:left-2 md:top-96 sm:left-12 xs:w-14 xs:h-8
        lg:w-16 lg:h-auto p-2 transition-all mx-auto flex
        duration-200 ease-in-out hover:bg-white/10 items-center group
        rounded-4xl">
            <div className="absolute p-1 bg-white z-50 hidden transition-all duration-200 ease-in-out md:group-hover:block 2xl:p-2 lg:bottom-16 2xl:left-2 xl:left-0 lg:left-2 bottom-12 -left-5
                    rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
                    after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
                    after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">
                <p className="text-black text-wrap 2xl:text-nowrap">go back</p>
            </div>
            <span className="mx-auto text-white lg:text-zinc-400 text-2xl sm:text-lg md:text-xl lg:text-3xl font-light">
                ←
            </span>
        </button>
    )
}