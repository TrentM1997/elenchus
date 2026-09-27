import { useState, useRef } from "react";
import { useScrollTrap } from "@/lib/hooks/rendering/useOverScrollTrap";
import { AnimatePresence, motion } from "framer-motion";
import { WikiSummaryResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

export default function StandardExtract({
  summary,
}: {
  summary: Extract<WikiSummaryResponseSchemaType, { kind: "summary" }>;
}): JSX.Element | null {
  const [readExtract, setReadExtract] = useState<boolean>(false);
  const scrollRef = useRef(null);
  useScrollTrap(scrollRef);

  return (
    <motion.main className="relative flex w-full flex-col gap-5 pb-5">
      <AnimatePresence mode="popLayout">
        {!readExtract && summary.description && (
          <motion.div
            layout
            key={"shortdescription"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: "tween", duration: 0.2, delay: 0 },
            }}
            exit={{
              opacity: 0,
              scale: 1,
              transition: { type: "tween", duration: 0.2, delay: 0 },
            }}
            className="w-full text-sm leading-7 font-light text-zinc-300"
          >
            {summary.description}
          </motion.div>
        )}
        {readExtract && summary.extract && (
          <motion.div
            id="wiki_extract"
            layout
            key={"fullbackground"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { type: "tween", duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              scale: 1,
              transition: { type: "tween", duration: 0.2 },
            }}
            className="h-64 max-h-[40dvh] w-full overflow-hidden relative"
          >
            <div
              ref={scrollRef}
              className="absolute inset-0 overflow-y-auto overscroll-contain pr-2 text-sm leading-7 font-light text-zinc-300"
            >
              {summary.extract}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full h-fit flex items-center justify-center gap-x-2">
        <button
          onClick={() => setReadExtract((readExtract) => !readExtract)}
          type="button"
          className="w-full min-h-10 px-4 py-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center
                 text-sm text-zinc-200 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {readExtract ? "Read description" : "Read full extract"}
        </button>
      </div>
    </motion.main>
  );
}
