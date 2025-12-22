import React from "react";
import SourceInfo from "../SourceInfo";
import type { Article } from "@/state/Reducers/Investigate/Reading";

interface MetaData {
    article: Article
};

function ArticleMetaData({ article }: MetaData): JSX.Element | null {

    return (
        <div className="group w-full h-full flex flex-col items-start justify-center gap-y-4 xl:gap-y-6">
            <SourceInfo article={article} />
        </div>
    );
};


export default React.memo(ArticleMetaData);