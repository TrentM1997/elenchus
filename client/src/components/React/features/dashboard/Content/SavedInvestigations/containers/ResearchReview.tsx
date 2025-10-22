import { useSelector, useDispatch } from "react-redux"
import { SourcesFromResearch } from "../Details/sources/SourcesUsed"
import { RootState } from "@/ReduxToolKit/store"
import { useLayoutEffect } from "react"
import { getInvestigationSources } from "@/services/supabase/SupabaseData"
import { getSourcesToReview } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations"
import DetailsTable from "../Details/DetailsTable"
import { Terms } from "../Details/wiki/containers/WikipediaTerms"
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary"
import LostData from "@/components/React/Shared/ErrorBoundaries/messages/LostData"
import DetailView from "../../../ProfileNavigation/mobile/DetailView"
import { presentResearch } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice"
import { ScrollUp } from "@/helpers/ScrollToTop"

export default function ResearchReview() {
    const investigation = useSelector((state: RootState) => state.userWork.investigationToReview);
    const sources = investigation ? investigation.sources : null;
    const savedArticles = useSelector((state: RootState) => state.userdata.userArticles)
    const dispatch = useDispatch()
    const cachedSources = JSON.parse(localStorage.getItem('cachedSources'))

    useLayoutEffect(() => {

        const retrieved = getInvestigationSources(sources, savedArticles)
        if (retrieved) {
            dispatch(getSourcesToReview(retrieved))
        }

        if (!sources && cachedSources) {
            dispatch(getSourcesToReview(cachedSources))
        }
    }, [investigation]);


    const backTo = (): void => {
        dispatch(presentResearch());
        ScrollUp();
    };


    return (
        <section
            className="h-full min-h-dvh w-full
          animate-fade-in duration-200">
            <DetailView backTo={backTo} />
            {investigation && <div className="w-full h-full pb-20 overscroll-contain overflow-y-scroll no-scrollbar grow flex flex-col gap-y-24 items-center justify-start">
                <ErrorBoundary>
                    <DetailsTable />
                    <SourcesFromResearch />
                    <Terms />
                </ErrorBoundary>
            </div>}


        </section>
    )
};