import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import { incrementStory, decrementStory, incrementStoryBy } from "@/state/Reducers/Investigate/Reading"
import type { ModalStages } from "@/state/Reducers/Investigate/WikipediaSlice"
import { modalStages } from "@/state/Reducers/Investigate/WikipediaSlice"
import { wait } from "@/helpers/formatting/Presentation"




export default function StoryPaginate() {
    const currentStory = useSelector((s: RootState) => s.investigation.read.currentStory);
    const articles = useSelector((s: RootState) => s.investigation.read.articles);
    const wikiModalState: ModalStages = useSelector((s: RootState) => s.investigation.wiki.wikiModalStages);
    const dispatch = useDispatch()


    const decrement = async () => {
        if (currentStory > 0) {
            if (wikiModalState.display === true) {
                dispatch(modalStages({
                    display: false,
                    highlight: false,
                    confirmExtract: false,
                    text: null
                }))
                await wait(200)
                dispatch(decrementStory())
            } else {
                dispatch(decrementStory());
            }
        };
    };

    const increment = async () => {

        if (currentStory < articles.length - 1) {
            if (wikiModalState.display === true) {
                dispatch(modalStages({
                    display: false,
                    highlight: false,
                    confirmExtract: false,
                    text: null
                }))
                await wait(200);
                dispatch(incrementStory());
            } else {
                dispatch(incrementStory())

            }
        }
    };

    return (
        <div className="z-20 flex relative">
            <button onClick={() => decrement()}
                className=" rounded-l-3xl border border-r-0 border-white/10
                         py-2 px-3 text-center text-sm transition-all shadow-sm 
                         hover:shadow-lg text-white hover:bg-white group">
                <svg className={`text-white group-hover:text-black w-4 h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                    <path d="M 33.960938 2.9804688 A 2.0002 2.0002 0 0 0 32.585938 3.5859375 L 13.585938 22.585938 A 2.0002 2.0002 0 0 0 13.585938 25.414062 L 32.585938 44.414062 A 2.0002 2.0002 0 1 0 35.414062 41.585938 L 17.828125 24 L 35.414062 6.4140625 A 2.0002 2.0002 0 0 0 33.960938 2.9804688 z" fill="currentColor" />
                </svg>
            </button>
            {(articles !== null) || (articles && articles.length > 1) ? articles.map((page: any, index: number) => (
                <button key={index} onClick={() => dispatch(incrementStoryBy(index))}
                    className={`${currentStory === index ? 'bg-white/10' : 'bg-black'} 
                        text-white rounded-md rounded-r-none rounded-l-none border border-r-0 border-white/10 py-2 px-3
                         text-center text-sm lg:text-base transition-all shadow-sm hover:shadow-lg hover:bg-white/10`}>
                    {index + 1}
                </button>
            )) : (<button
                className={`${currentStory === 1 ? 'bg-white/10' : 'bg-black'} 
                        text-white rounded-md rounded-r-none rounded-l-none border border-r-0 border-white/10 py-2 px-3
                         text-center text-sm transition-all shadow-sm hover:shadow-lg hover:bg-white/10`}>
                1
            </button>)}


            <button onClick={() => increment()} className="rounded-r-3xl text-white rounded-l-none border border-white/10 py-2 px-3 text-center text-sm transition-all
                         shadow-sm hover:shadow-lg hover:text-black hover:bg-white group
                         ">
                <svg className={`text-white group-hover:text-black w-4 h-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                    <path d="M17.586,44.414C17.977,44.805,18.488,45,19,45s1.023-0.195,1.414-0.586l19-19c0.781-0.781,0.781-2.047,0-2.828l-19-19 c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828L35.172,24L17.586,41.586C16.805,42.367,16.805,43.633,17.586,44.414z" fill="currentColor" />
                </svg>

            </button>
        </div>
    )
}