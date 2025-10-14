import { AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { BackToSearch } from "@/components/React/features/investigate/phase3/controls/buttons/BackToSearch";
import { GetTheseArticles } from "@/components/React/features/investigate/phase2/modals/GetTheseArticles";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";

export default function ModalContainer() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
    const { display, getArticle } = investigateState;
    const { chosenArticles } = getArticle;
    const { showBackToSearchModal, showGetArticlesModal } = display;



    return <AnimatePresence mode="wait">
        {showBackToSearchModal ? <BackToSearch key="goBack" /> : null}
        {showGetArticlesModal && <GetTheseArticles key="getContent" />}
    </AnimatePresence>
};