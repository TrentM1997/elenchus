import React from "react";

interface ArticleTitle {
    title: string | null
};

function ArticleTitle({ title }) {

    return (
        <div className="p-4">
            <h3

                className="text-xl md:text-base tracking-tight font-light xl:text-xl text-white/90 z-10 opacity-100 relative transition-all duration-200 ease-in-out">
                {title}
            </h3>
        </div>
    );
};


export default React.memo(ArticleTitle);