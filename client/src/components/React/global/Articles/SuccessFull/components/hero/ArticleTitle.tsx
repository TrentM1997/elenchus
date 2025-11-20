import React from "react";

interface ArticleTitle {
    title: string | null
};

function ArticleTitle({ title }) {

    return (
        <div className="p-4 w-full max-w-88 md:max-w-96">
            <h3

                className="text-sm md:text-base tracking-tight font-light xl:text-xl text-white/90 text-wrap z-10 opacity-100 relative transition-all duration-200 ease-in-out">
                {title}
            </h3>
        </div>
    );
};


export default React.memo(ArticleTitle);