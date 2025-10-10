import React from "react";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";

interface DatePubProps {
    article: Article
};

function PublishedBy({ article }: DatePubProps): JSX.Element | null {


    return (
        <div className="p-4 flex flex-row items-center justify-start gap-x-2 h-12">
            <div className="w-8 h-8 flex items-center justify-center z-10 opacity-100">
                <img src={article.logo} />
            </div>
            <a
                href={article.article_url}
                target="_blank"
                title={`Visit source at - ${article.article_url}`}
                className="text-sm h-auto flex items-center justify-start pb-0.5 w-fit 
                md:text-base tracking-tight text-zinc-400 hover:text-blue-400 transition-colors 
                duration-200 z-10 opacity-100 relative ease-[cubic-bezier(.2,.6,.2,1)]
                after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-blue-400 
         hover:after:w-full after:transition-all after:duration-300
                ">
                {article.provider}
            </a>


        </div>
    );
};

export default React.memo(PublishedBy);