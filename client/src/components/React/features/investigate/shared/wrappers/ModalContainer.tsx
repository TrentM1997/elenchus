import { AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { BackToSearch } from "@/components/React/features/investigate/phase3/controls/buttons/BackToSearch";
import { GetTheseArticles } from "@/components/React/features/investigate/phase2/modals/GetTheseArticles";
import ModalLayer from "@/components/React/Shared/modals/ModalLayer";

export default function ModalContainer() {
    const showGetArticlesModal: boolean = useSelector((s: RootState) => s.investigation.display.showGetArticlesModal);
    const showBackToSearchModal: boolean = useSelector((s: RootState) => s.investigation.display.showBackToSearchModal);

    return <AnimatePresence mode="wait">
        {showBackToSearchModal ? <ModalLayer key='back-to-search-overlay'><BackToSearch key="goBack" /> </ModalLayer> : null}
        {showGetArticlesModal && <GetTheseArticles key="getContent" />}
    </AnimatePresence>
};