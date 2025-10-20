import React from "react";

function SavedArticleImage({ imgProps }): JSX.Element | null {


    return (
        <img {...imgProps} />
    )
};


export default React.memo(SavedArticleImage);