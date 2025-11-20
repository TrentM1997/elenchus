import { useSelector, useDispatch } from "react-redux"
import { SourcesFromResearch } from "../Details/sources/SourcesUsed"
import { RootState } from "@/ReduxToolKit/store"
import { useLayoutEffect } from "react"
import { getInvestigationSources } from "@/services/supabase/SupabaseData"
import { getSourcesToReview } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations"
import DetailsTable from "../Details/DetailsTable"
import { Terms } from "../Details/wiki/containers/WikipediaTerms"
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary"
import DetailView from "../../../ProfileNavigation/mobile/DetailView"
import { ScrollUp } from "@/helpers/ScrollToTop"
import { chooseTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs"

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
        dispatch(chooseTab('Investigations'))
        ScrollUp();
    };


    return (
        <section
            className="h-full min-h-dvh w-full opacity-0
          animate-fade-blur animation-delay-200ms">
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