import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import type { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { AnimatePresence } from "framer-motion";
import renderModal from "../switches/renderModal";

function ModalPipeline(): JSX.Element {
    const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal);

    return (
        <AnimatePresence mode="wait">
            {renderModal(modal)}
        </AnimatePresence>
    );
};

export default ModalPipeline;