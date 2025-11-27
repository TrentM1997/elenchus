import LinkThumbnail from "./LinkThumbnail"
import LinkTitle from "./LinkTitle"
import LinkDescription from "./LinkDescription"
import React from "react";


function ArticleLink({
    article,
    inModal,
    isPriority,
    chooseArticle,
    mute,
    highlight
}: LinkProps) {

    const fallbackImage = '/images/logos/fallback.jpg';
    const thumbnail = article?.image ?? fallbackImage;
    const dimensions: string = `xl:min-h-72 xl:max-h-72 xl:min-w-80 xl:max-w-80
            lg:w-72 lg:h-72 md:h-60 md:w-60 sm:w-52 sm:h-52 h-72 w-76`;
    const transitions: string = `transition-[opacity,background-color] transform-gpu 
    will-change-[opacity,background-color,transform] ease-[cubic-bezier(.25,.8,.25,1)] 
            duration-300`;
    const styling: string = `group cursor-pointer box-border list-none flex-shrink-0  
    relative rounded-3xl sm:rounded-xl md:rounded-3xl text-white overflow-hidden`;
    const highlightedStyles: string = highlight ? 'bg-slate-700' : 'bg-mirage';
    const mutedStyles: string = ((mute) && (!highlight)) ? 'opacity-30 pointer-events-none' : 'pointer-events-auto opacity-80 hover:opacity-100';
    const inModalStyles: string = ((inModal) && (highlight)) ? 'opacity-75' : '';

    return (
        <li
            aria-label="Article to select"
            id="article-option"
            onClick={() => { chooseArticle(article) }}
            key={article.url}
            className={`${dimensions} ${transitions} ${styling}
            ${highlightedStyles} ${mutedStyles} ${inModalStyles}`}
        >
            <div className='relative w-full overflow-hidden
            xl:max-h-36 xl:min-h-36 md:min-h-28 md:min-w-28 sm:max-h-24 sm:min-h-24 min-h-32 max-h-32'>
                <LinkThumbnail
                    thumbnail={thumbnail}
                    name={article.name}
                    isPriority={isPriority}
                />
                <LinkTitle
                    name={article.name}
                />
            </div>
            <LinkDescription
                isPriority={isPriority}
                chosen={highlight}
                logo={article.logo}
                provider={article.provider}
                description={article.description}
                inModal={inModal}
            />
        </li>
    );
};


export default React.memo(ArticleLink);