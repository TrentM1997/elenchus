import { useDispatch } from "react-redux"
import { writingNote } from "@/ReduxToolKit/Reducers/Investigate/NoteTaking"
import PanelLabel from "./PanelLabel"

export default function TakeNotes({ failedExtraction }) {
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(writingNote());
    };

    return (
        <div className={`${failedExtraction ? 'pointer-events-none opacity-30' : 'pointer-events-auto opacity-100 lg:hover:bg-border_gray'}
            shrink-0 w-fit h-10 lg:h-auto lg:rounded-r-full px-2.5 md:py-1.5 lg:px-2.5
            transition-opacity ease-in-out flex justify-center group relative
             lg:border-0 border-border_gray`}>
            <button
                onClick={handleClick}
                className="md:w-fit md:h-auto max-w-8 max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 2xl:max-h-8
        rounded-lg transition-all duration-300 m-auto relative
        ease-in-out group">

                <div className="absolute p-1 bg-white z-50 opacity-0 transition-opacity duration-200 ease-soft delay-500 md:group-hover:opacity-100 bottom-[3.3rem] -left-4
            rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">
                    <p className="text-black" >Take Notes</p>
                </div>

                <div className="h-full w-full box-border">
                    <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        className="text-white md:group-hover:text-blue-400 transition-colors duration-200 ease-soft icon icon-tabler icons-tabler-outline icon-tabler-note"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 20l7 -7" /><path d="M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7" /></svg>

                </div>
            </button>
            <PanelLabel description={"notes"} />
        </div>

    )
}