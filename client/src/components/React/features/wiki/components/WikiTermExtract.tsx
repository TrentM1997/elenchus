import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect, useState } from "react";
import WikiExtractLoader from "../loaders/WikiExtractLoader";
import ExtractNotification from "../notifications/ExtractNotification";
import Description from "./WikiDescription";
import TermFooter from "./TermFooter";
import { variants } from "@/motion/variants";
import { WikiTerm } from "@/env";
import HighlightTextTip from "../tooltips/HighlightTextTip";
import {
  clearWikiSlice,
  modalStages,
  WikipediaExtractState,
} from "@/state/Reducers/Investigate/wiki/WikiSlice";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import EmptyState from "@/components/React/global/fallbacks/EmptyState";

export default function WikiTermExtract({ article_url }: WikiTerm) {
  const extract = useSelector((s: RootState) => s.investigation.wiki.extract);
  const dispatch = useDispatch<AppDispatch>();
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      dispatch(clearWikiSlice());
    };
  }, []);

  const termExtracted = (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      className="w-[17rem] h-80 xl:w-80 lg:h-auto p-2 rounded-3xl  
            bg-black border border-border_gray z-30
        flex flex-col items-center fixed lg:left-0.5 bottom-128 md:bottom-32 2xl:bottom-44 2xl:left-12"
    >
      <div className="min-w-full max-w-full h-auto relative">
        <WikiModalHeader />
        <RenderExtractContents extract={extract} />
        <TermFooter article_url={article_url} />
        <AnimatePresence>
          {showNotification && (
            <ExtractNotification setShowNotification={setShowNotification} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return createPortal(termExtracted, document.body);
}

function RenderExtractContents({
  extract,
}: {
  extract: WikipediaExtractState;
}) {
  return (
    <AnimatePresence mode="wait">
      <RenderExtract state={extract} />
    </AnimatePresence>
  );
}

function RenderExtract({ state }: { state: WikipediaExtractState }) {
  switch (state.status) {
    case "initial":
      return <HighlightTextTip />;

    case "failed": {
      return (
        <motion.div
          key={"rejectedExtract"}
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ type: "tween", duration: 0.2 }}
          className="text-white"
        >
          Couldn't extract information for the submitted term
        </motion.div>
      );
    }
    case "empty": {
      return <EmptyState />;
    }
    case "ready": {
      const extract = state.data;
      if (extract.kind === "disambiguation") {
      } else if (extract.kind === "error") {
        return <Extract />;
      } else {
        return <Extract key={"extract"} title={extract.title} />;
      }
    }
    case "pending": {
      return <WikiExtractLoader key={"wikiloader"} />;
    }

    default: {
      return assertNever(state);
    }
  }
}

interface ExtractTitle {
  title?: string | null;
}

function Extract({ title }: ExtractTitle): JSX.Element | null {
  return (
    <motion.div
      key="extract"
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
    >
      <figcaption className="flex flex-col h-12 w-full items-center gap-y-2">
        <h1 className="text-zinc-400 font-light text-center tracking-tight text-base mt-2">
          <em>{title}</em>
        </h1>
      </figcaption>
      <Description />
    </motion.div>
  );
}

function WikiModalHeader() {
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    dispatch(
      modalStages({
        display: false,
        highlight: false,
        confirmExtract: false,
        text: null,
      }),
    );
  };

  return (
    <>
      <div
        onClick={handleClose}
        className="cursor-pointer transition-all duration-200 ease-in-out absolute w-8 h-8 top-0 right-0 rounded-full p-1 md:hover:bg-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={"100%"}
          height={"100%"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler text-white icons-tabler-outline icon-tabler-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </div>
      <div className="w-full gap-x-2 px-2 mx-auto h-fit min-h-14 flex items-center justify-start">
        <div className="w-7 h-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={"100%"}
            height={"100%"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white icon icon-tabler icons-tabler-outline icon-tabler-brand-wikipedia"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 4.984h2" />
            <path d="M8 4.984h2.5" />
            <path d="M14.5 4.984h2.5" />
            <path d="M22 4.984h-2" />
            <path d="M4 4.984l5.455 14.516l6.545 -14.516" />
            <path d="M9 4.984l6 14.516l6 -14.516" />
          </svg>
        </div>
        <div className="w-auto h-fit">
          <p className="text-zinc-400 font-light text-lg">Wikipedia Extract</p>
        </div>
      </div>
    </>
  );
}
