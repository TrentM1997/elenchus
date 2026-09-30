import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ExtractBookmark from "./buttons/ExtractBookmark";
import TimeStamp from "./timestamp/TimeStamp";
import { useHandleSaveExtract } from "@/lib/hooks/useHandleSaveExtract";

export default function TermFooter({ article_url }: { article_url: string }) {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const extract = useSelector((s: RootState) => s.investigation.wiki.extract);
  const { handleSaveExtract, status, summary, disambig } = useHandleSaveExtract(
    { article_url },
  );

  return (
    <motion.footer
      className={`${extract.status === "ready" ? "opacity-100" : "opacity-0"} transition-opacity duration-200 ease-in
        w-full border-t border-white/10 pt-4 flex shrink-0 items-center justify-between gap-3`}
    >
      <TimeStamp disambig={disambig} summary={summary} />
      {userKind === "authenticated" && extract.status === "ready" && (
        <ExtractBookmark
          saved={status === "saved"}
          handleSave={handleSaveExtract}
          status={status}
        />
      )}
    </motion.footer>
  );
}
