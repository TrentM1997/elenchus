import React, { useEffect, useRef, useState } from "react";
import type { SelectedArticle } from "@/env";

interface CurrentChosen {
    chosenArticles: SelectedArticle[] | null
};

function CurrentChosen({ chosenArticles }: CurrentChosen): JSX.Element {
    const selectedTotal = chosenArticles.length
    const selectedArticles = `${selectedTotal}/3`;
    const [phase, setPhase] = useState<"idle" | "shimmer" | "fadeout">("idle");
    const timerRef = useRef<number | null>(null);


    useEffect(() => {
        if (selectedTotal === 3) {
            setPhase("shimmer");
            timerRef.current = window.setTimeout(() => setPhase("fadeout"), 6000); // 0.5s before end
            return () => clearTimeout(timerRef.current!);
        }
        setPhase("idle");

        return () => { //line i addeded
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            };
        };
    }, [selectedTotal]);


    return (
        <div className="h-full my-auto">
            <p
                className="text-base text-zinc-400 md:text-xl 2xl:text-2xl"
            >{selectedTotal === 3 ? 'Articles chosen' : 'Choose articles'}
                <span
                    className={`
    font-semibold ml-2 xl:ml-6
    transition-[color,background-position] duration-500 ease-in-out
    will-change-[background-position, transform] transform-gpu
    ${phase === "shimmer" ? `
      inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
      bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer
    ` : ""}
    ${phase === "fadeout" ? "text-zinc-300" : ""}
    ${phase === "idle" && selectedTotal < 3 ? "text-blue-500" : ""}
  `}
                >
                    {selectedArticles}
                </span>

            </p>
        </div>
    );
};


export default React.memo(CurrentChosen);
