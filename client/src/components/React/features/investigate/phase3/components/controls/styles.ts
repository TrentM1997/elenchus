import { panelmotions } from "@/motion/variants";

export const controlPanelCSS = `fixed lg:sticky 2xl:left-16 2xl:bottom-16 transform-gpu will-change-transform z-[910]
        xl:left-4 xl:bottom-10 lg:left-6 lg:bottom-6 w-fit shadow-material
        bottom-0 left-0 right-0 flex items-start lg:items-center justify-center gap-x-4 lg:gap-x-0
         lg:shadow-black py-1 md:py-0 px-4 lg:px-0 md:px-0 mx-auto lg:mx-0
        h-14 lg:h-auto bg-zinc-900 xl:bg-astro_black rounded-t-2xl lg:rounded-full pointer-events-auto
         md:ring-1 md:ring-border_gray/70`;

export const motionprops = {
  variants: panelmotions,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};
