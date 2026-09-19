import { ActiveModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export function getHeroContainerStyles(modal: ActiveModal) {
  return `w-dvw h-full min-h-44 lg:min-h-52 shrink-0 mx-auto 
            transition-opacity duration-200 ease-in-out flex items-center
        ${modal === "Work Modal" ? "opacity-50" : "opacity-100"}
        `;
}
