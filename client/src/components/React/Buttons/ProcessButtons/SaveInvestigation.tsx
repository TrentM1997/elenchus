import { RootState } from "@/ReduxToolKit/store"
import { useSelector } from "react-redux"
import { fetchSavedInvestigations } from "@/ReduxToolKit/Reducers/UserContent.ts/UserInvestigations"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/ReduxToolKit/store"
import { saveUserInvestigation } from "@/ReduxToolKit/Reducers/UserContent.ts/SaveInvestigationSlice"
import { useEffect, useState } from "react"

export default function SaveInvestigation({ }) {
    const id = useSelector((state: RootState) => state.auth.user_id)
    const saved = useSelector((state: RootState) => state.saveResearch.saved)
    const sources = useSelector((state: RootState) => state.saveResearch.sources)
    const investigateState = useSelector((state: RootState) => state.investigation)
    const [prevWork, setPrevWork] = useState<any>(null)
    const { pov, review } = investigateState
    const { idea, premises, perspective, biases } = pov
    const { endingPerspective, newConcepts, merit, takeaway, movedOnIdea, extracts } = review
    const dispatch = useDispatch<AppDispatch>()

    const investigateData = {
        idea: idea,
        premises: premises,
        initial_perspective: perspective,
        biases: biases,
        ending_perspective: endingPerspective,
        new_concepts: newConcepts,
        changed_opinion: movedOnIdea,
        takeaway: takeaway,
        had_merit: merit,
        user_id: id,
        sources: sources,
        wikipedia_extracts: extracts
    }

    useEffect(() => {

        const storedWork: any = localStorage.getItem('userWork');

        if (storedWork) setPrevWork(storedWork);

    }, [saved]);

    const handleSave = () => {
        dispatch(saveUserInvestigation(investigateData))
        dispatch(fetchSavedInvestigations(id))
    }

    return (
        <button
            onClick={handleSave}
            className={`bg-white w-auto 2xl:w-60 hover:bg-white/10 group shadow-thick 
                    transition-all duration-200 ease-in-out rounded-full h-fit py-2 px-4 mx-auto flex items-center`}>
            <p className={`${saved ? 'text-slate-500' : 'text-black'} transition-all duration-200 ease-in-out
             w-full text-xs 2xl:text-lg text-nowrap group-hover:text-white font-light text-center`}>
                Save your research <span className="ml-2">&#8594;</span>
            </p>
        </button>
    )
}