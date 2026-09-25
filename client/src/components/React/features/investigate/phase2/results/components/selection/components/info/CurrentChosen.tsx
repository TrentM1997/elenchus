import React from "react";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useShimmerChosenText } from "@/lib/hooks/rendering/useShimmerChosenText";

interface CurrentChosen {
  chosenArticles: SelectedArticles;
}

function CurrentChosen({ chosenArticles }: CurrentChosen): JSX.Element | null {
  const { message, phase } = useShimmerChosenText({ chosenArticles });

  return (
    <div className="h-full my-auto">
      <p className="text-base text-zinc-400 md:text-xl 2xl:text-2xl">
        {chosenArticles.status === "max"
          ? "Articles chosen"
          : "Choose articles"}
        <span
          className={`
    font-semibold ml-2 xl:ml-6
    transition-[color,background-position] duration-500 ease-in-out
    will-change-[background-position, transform] transform-gpu
    ${
      phase === "shimmer"
        ? `
      inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
      bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer
    `
        : ""
    }
    ${phase === "fadeout" ? "text-zinc-300" : ""}
    ${phase === "idle" && chosenArticles.status !== "max" ? "text-blue-500" : ""}
  `}
        >
          {message}
        </span>
      </p>
    </div>
  );
}

export default React.memo(CurrentChosen);
