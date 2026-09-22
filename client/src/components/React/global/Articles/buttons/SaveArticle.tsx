import NotifySavedArticle from "../notifications/NotifySaved";
import SaveArticleTooltip from "../tooltips/SaveArticleTooltip";
import { useSaveArticle } from "@/hooks/useSaveArticle";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Bookmark({ article, open }: SaveArticleButton) {
  const { handleSaveArticle, status } = useSaveArticle({
    article,
  });
  const [notification, setNotification] = useState<string | null>(null);

  return (
    <div
      onClick={handleSaveArticle}
      className={`${open ? "pointer-events-none" : "pointer-events-auto"} 
            w-full h-full self-start flex items-center justify-start 
            group relative cursor-pointer`}
    >
      {!notification && (
        <SaveArticleTooltip isSaved={status === "bookmarked"} />
      )}
      <AnimatePresence>
        {notification && (
          <NotifySavedArticle
            message={status}
            setNotification={setNotification}
          />
        )}
      </AnimatePresence>

      <BookmarkSVG isSaved={status === "bookmarked"} />
    </div>
  );
}

interface BookmarkSVGProps {
  isSaved: boolean;
}

function BookmarkSVG({ isSaved }: BookmarkSVGProps): JSX.Element {
  return (
    <svg
      className={`${isSaved ? "text-white" : "text-white/30 hover:text-white/60"}
            transition-all duration-200 ease-in-out`}
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={30}
      height={30}
      viewBox="0,0,256,256"
    >
      <g
        fill="currentColor"
        fillRule="nonzero"
        stroke="none"
        strokeWidth={1}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray=""
        strokeDashoffset={0}
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
        style={{ mixBlendMode: "normal" }}
      >
        <g transform="scale(8.53333,8.53333)">
          <path d="M23,27l-8,-7l-8,7v-22c0,-1.105 0.895,-2 2,-2h12c1.105,0 2,0.895 2,2z" />
        </g>
      </g>
    </svg>
  );
}
