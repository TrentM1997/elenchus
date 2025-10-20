import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { displayGetArticlesModal, displaySelectionWarning, displaySelectTooltip } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer";
import { AppDispatch } from "@/ReduxToolKit/store";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";

export default function RetrieveChosenArticles() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { chosenArticles } = investigateState.getArticle;
    const dispatch = useDispatch<AppDispatch>()

    const handleSummaries = () => {
        if (chosenArticles.length > 0) {
            dispatch(displayGetArticlesModal(true))
        } else {
            dispatch(displaySelectionWarning(true))
        }
    };


    return (
        <div >
            <button className={`group`}>
                <div
                    onClick={handleSummaries}
                    className="flex items-center justify-center bg-white
                  flex-nowrap rounded-3xl transition-all ease-in-out duration-200 text-black px-5 py-2 w-full h-auto
              group-hover:bg-mirage group-hover:text-white
              top-2.5 text-base">
                    <div className="w-full">
                        <p className="text-black text-sm font-normal sm:text-base md:text-lg group-hover:text-white 
                    text-nowrap transition-all duration-200 ease-in-out">
                            Retrieve these articles &rarr;
                        </p>
                    </div>
                </div>

            </button>
        </div>
    );
};

