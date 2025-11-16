import { AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import BackToSearch from "../../phase3/components/modals/BackToSearch";
import { GetTheseArticles } from "@/components/React/features/investigate/phase2/modals/GetTheseArticles";
import ModalLayer from "@/components/React/Shared/modals/ModalLayer";
import { ModalDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

export default function ModalContainer() {
    const modal: ModalDisplayed = useSelector((s: RootState) => s.investigation.rendering.modal);

    return <AnimatePresence mode="wait">
        {(modal === 'Back to Search') && <ModalLayer key='back-to-search-overlay'>
            <BackToSearch key="goBack" />
        </ModalLayer>
        }
        {(modal === 'Extract Confirmation') &&
            <ModalLayer key='get-these-articles-overlay'>
                <GetTheseArticles key="getContent" />
            </ModalLayer>
        }
    </AnimatePresence>
};