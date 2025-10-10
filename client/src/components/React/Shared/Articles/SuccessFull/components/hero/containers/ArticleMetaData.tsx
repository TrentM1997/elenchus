import React from "react";
import SourceInfo from "../SourceInfo";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";

interface MetaData {
    article: Article
};

function ArticleMetaData({ article }: MetaData): JSX.Element | null {

    return (
        <div className="group w-full h-full flex flex-col items-start gap-y-4 lg:gap-y-5">
            <SourceInfo article={article} />
        </div>
    );
};


export default React.memo(ArticleMetaData);