import { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import React from "react";

interface SourceDate {
    article: Article
};

function Source({ article }: SourceDate): JSX.Element | null {

    return (
        <div>
            <p className="text-blue-400 text-xs">
                Source <span>
                    <span className="text-zinc-400 px-1">•</span> <time className="text-zinc-400 transition-all ease-in-out duration-200" dateTime={article.date_published}>
                        {article.provider}
                    </time>
                </span>
            </p>
        </div>
    );
};

export default React.memo(Source);