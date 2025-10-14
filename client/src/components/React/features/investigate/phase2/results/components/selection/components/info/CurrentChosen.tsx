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
                className="text-base md:text-xl 2xl:text-2xl"
            >Choose articles
                <span
                    className={`
                text-blue-500 font-bold tracking-tight mx-2 
                ${selectedTotal === 3
                            ? 'animate-pulse transition-opacity ease-soft'
                            : null}`
                    }
                >
                    {selectedArticles}
                </span>
            </p>
        </div>
    );
};


export default React.memo(CurrentChosen);
