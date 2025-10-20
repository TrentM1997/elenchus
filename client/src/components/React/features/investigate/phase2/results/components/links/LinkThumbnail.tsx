import React from "react";

type FetchPriority = 'high' | 'low' | 'auto';

type LoadingTypes = 'eager' | 'lazy'

export type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchpriority?: FetchPriority;
    loading?: LoadingTypes;
    isPriority?: boolean // lowercase HTML attr
};


interface LinkThumbnail {
    imgProps: ImgProps
};

function LinkThumbnail({ thumbnail, name, isPriority }): JSX.Element | null {

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
        <div
            className='absolute inset-0 w-full h-full bg-cover 
            bg-center opacity-40 rounded-t-xl md:rounded-t-3xl'
        >
            <img
                {...imgProps}
            />
        </div>
    );
};

export default React.memo(LinkThumbnail);