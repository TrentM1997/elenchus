import LinkThumbnail from "./LinkThumbnail"
import LinkTitle from "./LinkTitle"
import LinkDescription from "./LinkDescription"
import React from "react";

type FetchPriority = 'high' | 'low' | 'auto';

type LoadingTypes = 'eager' | 'lazy'

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchpriority?: FetchPriority;
    loading?: LoadingTypes;
    isPriority?: boolean // lowercase HTML attr
};


function ArticleLink({ article, inModal, isPriority, chooseArticle, showGetArticlesModal, mute, chosenArticles }: LinkProps) {
    const { name, provider, description, logo } = article;
    const chosen = chosenArticles.some((item: SelectedArticle) => item.url === article.url);
    const fallbackImage = '/images/logos/fallback.jpg';
    const thumbnail = article.image.img ?? fallbackImage;
    const highlight = (chosen && (!inModal));
    const imgProps: ImgProps = {
        src: thumbnail,
        alt: name,
        loading: isPriority ? 'eager' : 'lazy',
        decoding: 'async',
        fetchpriority: 'auto',
        className: 'absolute inset-0 h-full w-full object-cover',
        onError: (e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = '/images/logos/fallback.jpg';
        },
    };


    return (
        <li

            onClick={() => { chooseArticle(article) }}
            key={article.url}
            className={`group cursor-pointer box-border list-none flex-shrink-0 
            xl:min-h-72 xl:max-h-72 xl:min-w-80 xl:max-w-80
            lg:w-72 lg:h-72 md:h-60 md:w-60 sm:w-52 sm:h-52 h-72 w-76
            relative rounded-3xl sm:rounded-xl md:rounded-3xl text-white 
            ${mute && !chosen && !showGetArticlesModal ? 'opacity-30 pointer-events-none' : 'pointer-events-auto opacity-80 hover:opacity-100'}
             transition-all ease-[cubic-bezier(.25,.8,.25,1)] 
            duration-300 overflow-y-hidden overflow-x-hidden
            ${inModal && chosen ? 'opacity-75' : ''}
            ${highlight ? "shadow-blue-bottom bg-ebony" : "shadow-material bg-mirage"}`}
        >

            <div className='relative w-full overflow-hidden
            xl:max-h-36 xl:min-h-36 md:min-h-28 md:min-w-28 sm:max-h-24 sm:min-h-24 min-h-32 max-h-32'>
                <LinkThumbnail
                    imgProps={imgProps}
                />
                <LinkTitle
                    name={name}
                />
            </div>
            <LinkDescription
                isPriority={isPriority}
                chosen={chosen}
                logo={logo}
                provider={provider}
                description={description}
            />
        </li>
    );
};


export default React.memo(ArticleLink);