import ModalLayer from "@/components/React/global/modals/ModalLayer";
import SignOutModal from "@/components/React/session/forms/AuthForms/SignOutModal";
import Popover from "@/components/React/features/blueSky/Popovers/Popover";
import { GetTheseArticles } from "@/components/React/features/investigate/phase2/modals/GetTheseArticles";
import BackToSearch from "@/components/React/features/investigate/phase3/components/modals/BackToSearch";
import DeleteUserAccount from "@/components/React/session/modals/DeleteUser";
import FeedBackForm from "@/components/React/session/forms/UserFeedback/FeedbackForm";
import { PreviousWork } from "../../features/investigate/phase5/modals/PreviousWork";
import type { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import ArticleExtractionToast from "../../global/modals/ArticleExtactionToast";

const renderModal = (modal: ActiveModal): JSX.Element | null => {

    switch (modal) {
        case 'Sign Out':
            return (
                <ModalLayer key={'signout-layer'}>
                    <SignOutModal />
                </ModalLayer>
            );
        case 'Bluesky Post Selected':
            return (
                <ModalLayer key='bluesky-layer'>
                    <Popover />
                </ModalLayer>
            );
        case 'Extract Confirmation':
            return (
                <ModalLayer mountDelay={0.6} key='extract-layer'>
                    <GetTheseArticles />
                </ModalLayer>
            );

        case 'Back to Search':
            return (
                <ModalLayer key='back-to-search-layer'>
                    <BackToSearch />
                </ModalLayer>
            );

        case 'Delete Account':
            return (
                <ModalLayer key='delete-account-layer'>
                    <DeleteUserAccount />
                </ModalLayer>
            );

        case 'Feedback Form':
            return (
                <ModalLayer key='feedback-form-layer'>
                    <FeedBackForm />
                </ModalLayer>
            );
        case "Work Modal":
            return (
                <ModalLayer key={'prev-work-modal'}>
                    <PreviousWork />
                </ModalLayer>
            )
        case "Article Extraction Warning":
            return (
                <ModalLayer key={'extraction-warning'}>
                    <ArticleExtractionToast />
                </ModalLayer>
            )
        case null:
            return null;


        default: {
            const exhaustive: never = modal;
            return null
        }
    }
};

export default renderModal;