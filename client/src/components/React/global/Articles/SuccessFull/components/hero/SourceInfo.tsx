import { Article } from "@/state/Reducers/Investigate/Reading";
import React from "react";

interface SourceInfoProps {
    article: Article
};

function SourceInfo({ article }: SourceInfoProps): JSX.Element | null {

    return (
        <>
            <div>
                <p className="text-blue-400 text-xs">
                    Published <span className="text-zinc-400 px-1">•</span> <span className="text-zinc-400 transition-all ease-in-out duration-200">
                        {article.date_published ?? "Date of publication unavailable"}
                    </span>
                </p>
            </div>
            <div>
                <p className="text-blue-400 text-xs">
                    Source Bias <span className="text-zinc-400 px-1">•</span> <span className="text-zinc-400 transition-all ease-in-out duration-200">
                        {article.bias ? article.bias : 'Unknown'}
                    </span>
                </p>
            </div>

        </>
    );
};

export default React.memo(SourceInfo);