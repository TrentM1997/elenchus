import { useDispatch, useSelector } from "react-redux"
import { writingNote } from "@/state/Reducers/Investigate/NoteTaking"
import PanelLabel from "./PanelLabel"
import { RootState } from "@/state/store"
import ButtonHoverTooltip from "../../tooltips/ButtonHoverTooltip";

export default function TakeNotes({ failedExtraction }) {
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);
    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(writingNote());
    };

    return (
        <div className={`${failedExtraction ? 'pointer-events-none opacity-30' : 'pointer-events-auto opacity-100 lg:hover:bg-border_gray/40'}
            shrink-0 w-fit h-10 lg:h-auto lg:rounded-r-full px-2.5 md:py-1.5 lg:px-2.5  group cursor-pointer
            transition-all ease-soft duration-300 flex justify-center group relative
             lg:border-0 border-border_gray`}>
            <button
                onClick={handleClick}
                className="md:w-fit md:h-auto max-w-8 max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 2xl:max-h-8
        rounded-lg transition-all duration-300 m-auto relative
        ease-in-out group">

                {!takingNotes && <ButtonHoverTooltip description="take notes" />
                }

                <div className="h-full w-full box-border">
                    <NotesButton />
                </div>
            </button>
            <PanelLabel description={"notes"} />
        </div>

    )
}


function NotesButton(): JSX.Element {
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
            className={`
                ${takingNotes ? 'text-blue-500' : 'text-white'}
                md:group-hover:text-blue-500 will-change-transform transition-colors delay-150 duration-300 ease-soft icon icon-tabler icons-tabler-outline icon-tabler-note`}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 20l7 -7" />
            <path d="M13 20v-6a1 1 0 0 1 1 -1h6v-7a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7" />
        </svg>

    )
}