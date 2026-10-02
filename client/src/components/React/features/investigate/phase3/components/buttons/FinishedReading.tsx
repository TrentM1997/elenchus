import GuideDoneReading from "../tooltips/GuideDoneReading";
import PanelLabel from "./PanelLabel";
import { AnimatePresence } from "framer-motion";
import ButtonHoverTooltip from "../../tooltips/ButtonHoverTooltip";
import { useFinishedReadingTooltip } from "@/lib/hooks/articles/useFinishReadingTooltip";
import { usePushWrittenNotesToResearch } from "@/lib/hooks/notes/usePushWrittenNotesToResearch";
import { smoothScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { startReflection } from "@/state/Reducers/Investigate/research/ResearchSlice";

export function FinishedReading() {
  const dispatch = useDispatch<AppDispatch>();
  const { pushNotes } = usePushWrittenNotesToResearch();
  const { articles, guideTip } = useFinishedReadingTooltip();

  const advance = async (): Promise<void> => {
    smoothScrollUp();
    await wait(500);
    dispatch(
      startReflection({
        ending_perspective: null,
        changed_opinion: null,
        had_merit: null,
        new_concepts: null,
        takeaway: null,
      }),
    );
  };

  const advancePhase = () => {
    pushNotes();
    void advance();
  };

  return (
    <div
      className={`${
        articles.status === "error"
          ? "pointer-events-none opacity-30"
          : "pointer-events-auto opacity-100 lg:hover:bg-border_gray/40"
      }
            shrink-0 w-fit h-10 lg:h-auto px-2 md:py-1.5 xl:px-2 2xl:px-2.5 relative
              transition-all ease-soft duration-300 flex justify-center lg:border-r group cursor-pointer
              border-border_gray
              `}
    >
      <AnimatePresence>
        {articles.status === "ready" &&
          guideTip === "Finished Reading Button" && <GuideDoneReading />}
      </AnimatePresence>
      <button
        onClick={() => advancePhase()}
        className="my-auto mx-auto rounded-lg transition-all 
        duration-300 max-w-8 max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 group
        2xl:max-h-8 ease-in-out group relative"
      >
        {guideTip !== "Finished Reading Button" && (
          <ButtonHoverTooltip description="done reading" />
        )}
        <div className="h-full w-full box-border">
          <ForwardArrow />
        </div>
      </button>
      <PanelLabel description={"done"} />
    </div>
  );
}

function ForwardArrow(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={"100%"}
      height={"100%"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-right will-change-transform
        text-button_blue/90 delay-150 lg:group-hover:scale-[1.35] lg:group-hover:text-button_blue transition-all ease-soft duration-300"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2l.324 .005a10 10 0 1 1 -.648 0l.324 -.005zm.613 5.21a1 1 0 0 0 -1.32 1.497l2.291 2.293h-5.584l-.117 .007a1 1 0 0 0 .117 1.993h5.584l-2.291 2.293l-.083 .094a1 1 0 0 0 1.497 1.32l4 -4l.073 -.082l.064 -.089l.062 -.113l.044 -.11l.03 -.112l.017 -.126l.003 -.075l-.007 -.118l-.029 -.148l-.035 -.105l-.054 -.113l-.071 -.111a1.008 1.008 0 0 0 -.097 -.112l-4 -4z" />
    </svg>
  );
}
