import { AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store"
import type { Phase } from "@/state/Reducers/Investigate/Rendering"
import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice"
import renderHero from "../../switches/renderHero"


export default function HeroContainer() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const modal: ActiveModal = useSelector((s: RootState) => s.overlay.modal)

    return (
        <section className={`w-dvw h-full min-h-44 lg:min-h-52 shrink-0 mx-auto 
            transition-opacity duration-200 ease-in-out flex items-center
        ${(modal === 'Work Modal')
                ? 'opacity-50'
                : 'opacity-100'
            }
        `}>
            <AnimatePresence mode="wait">
                {renderHero(phase)}
            </AnimatePresence>

        </section>
    );
};