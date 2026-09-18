import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import SaveExtractTooltip from "../tooltips/SaveExtractTooltip";
import ExtractBookmark from "./buttons/ExtractBookmark";
import TimeStamp from "./timestamp/TimeStamp";
import { useHandleSaveExtract } from "@/lib/hooks/useHandleSaveExtract";

export default function TermFooter({ article_url }: { article_url: string }) {
  const extract = useSelector((s: RootState) => s.investigation.wiki.extract);
  const { handleSaveExtract, status, summary, disambig } = useHandleSaveExtract(
    { article_url },
  );

  return (
    <motion.footer
      className={`${extract.status === "ready" ? "opacity-100" : "opacity-0"} transition-opacity duration-200 ease-in
        min-w-full h-16 flex shrink-0 items-center justify-between`}
    >
      <TimeStamp disambig={disambig} summary={summary} />
      <div className="h-6 w-6 cursor-pointer group relative">
        {extract.status === "ready" && (
          <>
            <SaveExtractTooltip
              saved={status === "saved"}
              saving={status === "pending"}
            />
            <ExtractBookmark
              saved={status === "saved"}
              handleSave={handleSaveExtract}
            />
          </>
        )}
      </div>
    </motion.footer>
  );
}
