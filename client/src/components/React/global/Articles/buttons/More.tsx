import { useState } from "react";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

interface MoreProps {
  setOpen: (open: boolean) => void;
  articleData: Pick<ArticleSchemaType, "article_url" | "factual_reporting" | "country">;
}

const actionClassName = "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-light text-zinc-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export default function More({ setOpen, articleData }: MoreProps) {
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  return (
    <div
      className="absolute bottom-full right-0 z-30 mb-3 w-64 max-w-[calc(100vw-4rem)] rounded-2xl border border-white/10 bg-[#18191c] p-2 text-zinc-300 shadow-xl shadow-black/25"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="mb-1 flex items-center justify-between gap-4 px-3 py-1.5">
        <span className="text-xs font-light tracking-tight text-zinc-400">
          {showSourceDetails ? "Source info" : "Article options"}
        </span>
        <button
          type="button"
          aria-label="Close article options"
          onClick={() => setOpen(false)}
          className="-mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {showSourceDetails ? (
        <SourceDetails articleData={articleData} toggleDetails={() => setShowSourceDetails(false)} />
      ) : (
        <MoreOptions url={articleData.article_url} toggleDetails={() => setShowSourceDetails(true)} />
      )}
    </div>
  );
}

function SourceDetails({ articleData, toggleDetails }: {
  articleData: MoreProps["articleData"];
  toggleDetails: () => void;
}) {
  return (
    <div>
      <dl className="space-y-4 px-3 pb-4 pt-2 text-sm font-light tracking-tight">
        <div className="space-y-1">
          <dt className="text-xs text-zinc-400">Reporting integrity</dt>
          <dd className="break-words text-zinc-200">{articleData.factual_reporting ?? "Unknown"}</dd>
        </div>
        <div className="space-y-1">
          <dt className="text-xs text-zinc-400">Country of origin</dt>
          <dd className="break-words text-zinc-200">{articleData.country ?? "Unknown"}</dd>
        </div>
      </dl>
      <div className="border-t border-white/10 pt-1">
        <button type="button" onClick={toggleDetails} className={actionClassName}>
          <span className="flex items-center gap-2"><span aria-hidden="true">←</span> Back</span>
        </button>
      </div>
    </div>
  );
}

function MoreOptions({ url, toggleDetails }: { url: string; toggleDetails: () => void }) {
  return (
    <div className="space-y-1">
      <a href={url} target="_blank" rel="noopener noreferrer" className={actionClassName}>
        Visit source <span aria-hidden="true" className="text-zinc-500">↗</span>
      </a>
      <button type="button" onClick={toggleDetails} className={actionClassName}>
        Source info <span aria-hidden="true" className="text-zinc-500">→</span>
      </button>
    </div>
  );
}
