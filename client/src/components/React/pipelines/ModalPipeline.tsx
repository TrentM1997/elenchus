import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import type { ActiveModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice";
import { AnimatePresence } from "framer-motion";
import ModalLayer from "../Shared/modals/ModalLayer";
import SignOutModal from "../session/forms/AuthForms/SignOutModal";
import Popover from "../features/blueSky/Popovers/Popover";
import { GetTheseArticles } from "../features/investigate/phase2/modals/GetTheseArticles";
import BackToSearch from "../features/investigate/phase3/components/modals/BackToSearch";
import DeleteUserAccount from "../session/modals/DeleteUser";
import FeedBackForm from "../session/forms/UserFeedback/FeedbackForm";


function ModalPipeline(): JSX.Element {
    const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);


    return (
        <>
            <AnimatePresence
                mode="wait"
            >
                {(modal === 'Sign Out') &&
                    <ModalLayer
                        key={'signout-layer'}
                    >
                        <SignOutModal
                            key={'signout-modal'}
                        />
                    </ModalLayer>}

                {(modal === 'Bluesky Post Selected' &&
                    <ModalLayer key='bluesky-modal-layer'>
                        <Popover key={'bluesky-post-selected'} />
                    </ModalLayer>
                )}

                {(modal === 'Extract Confirmation') &&
                    <ModalLayer mountDelay={0.6} key={'extract-overlay'}>
                        <GetTheseArticles key='extract-confirmation' />
                    </ModalLayer>
                }
                {(modal === 'Back to Search') &&
                    <ModalLayer key={'back-to-search-layer'} >
                        <BackToSearch />
                    </ModalLayer>
                }

                {(modal === 'Delete Account') &&
                    <ModalLayer key={'delete-account-layer'}>
                        <DeleteUserAccount key={'delete-account-modal'} />
                    </ModalLayer>
                }

                {(modal === 'Feedback Form') &&
                    <ModalLayer key={'feedback-form-layer'} >
                        <FeedBackForm key={'feedback-modal'} />
                    </ModalLayer>
                }

            </AnimatePresence>

        </>
    );
};


export default ModalPipeline;