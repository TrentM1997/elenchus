import { RootState } from "@/ReduxToolKit/store"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { PreviousWork } from "../modals/PreviousWork";
import { clearCachedPlayStates } from "@/components/React/routing/routes/InvestigateRoute";
import { PLAYSTATE_KEYS } from "@/components/React/routing/routes/InvestigateRoute";
import { renderModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice";

export default function InvestigateMore() {
    const [open, setOpen] = useState<boolean>(false)
    const activeSession = useSelector((state: RootState) => state.auth.activeSession);
    const saved = useSelector((state: RootState) => state.saveResearch.saved)
    const dispatch = useDispatch()


    const showModal = () => {
        if (saved && activeSession) {
            dispatch({ type: 'clear' });
            clearCachedPlayStates(PLAYSTATE_KEYS);
        } else if (activeSession && !saved) {
            dispatch(renderModal('Work Modal'));
            setOpen(true)
        } else if (!activeSession) {
            dispatch(renderModal('Feedback Form'));
            dispatch({ type: 'clear' });
            clearCachedPlayStates(PLAYSTATE_KEYS);
        }
    };



    return (
        <button
            onClick={showModal}
            className="2xl:w-60 bg-white hover:bg-white/10 group shadow-thick 
                    transition-colors duration-200 ease-in-out rounded-full h-fit py-2 px-4 mx-auto flex items-center">
            <p className="text-black w-full text-xs 2xl:text-lg text-nowrap group-hover:text-white font-light text-center">
                Investigate More <span className="ml-2">&#8594;</span>
            </p>
            {open && <PreviousWork />}
        </button>
    )
}