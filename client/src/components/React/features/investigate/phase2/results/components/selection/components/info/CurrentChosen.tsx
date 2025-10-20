import React from "react";
import type { SelectedArticle } from "@/env";

interface CurrentChosen {
    chosenArticles: SelectedArticle[] | null
};

function CurrentChosen({ chosenArticles }: CurrentChosen): JSX.Element {
    const selectedTotal = chosenArticles.length
    const selectedArticles = `${selectedTotal}/3`


    return (
        <div className="h-full my-auto">
            <p
                className="text-base text-zinc-400 md:text-xl 2xl:text-2xl"
            >{selectedTotal === 3 ? 'Articles chosen' : 'Choose articles'}
                <span
                    className={`
                  font-bold tracking-tight ml-2 xl:ml-6 
                ${selectedTotal === 3
                            ? `inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
         bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer`
                            : 'text-blue-500'}`
                    }
                >
                    {selectedArticles}
                </span>
            </p>
        </div>
    );
};


export default React.memo(CurrentChosen);
