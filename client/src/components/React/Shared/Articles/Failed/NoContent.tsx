import { useEffect, useState } from "react";
import type { ExtractionToast } from "@/components/React/app/App";

export default function NoContent(): JSX.Element | null {
    const [showExtractionFallback, setShowExtractionFallback] = useState<boolean>(false);

    useEffect(() => {
        const TOASTKEY: string = 'extraction-toast:v1';

        let parsed: ExtractionToast | null;
        try {
            const raw = window.sessionStorage.getItem(TOASTKEY);
            parsed = JSON.parse(raw);
            if (parsed) {
                setShowExtractionFallback(true);
            };
        } catch { };

    }, []);


    return (
        <div
            className="opacity-0 animate-fade-blur animation-delay-400ms transition-opacity h-full w-full"
        >
            <div className="w-full h-full flex items-start md:items-center justify-center">
                {!showExtractionFallback && <FailedScrape />}
                {showExtractionFallback && <ExtractionServiceDown />}

            </div>
        </div>
    );
};


function FailedScrape(): JSX.Element | null {

    return (
        <div className="w-fit h-fit flex flex-col justify-center items-center gap-y-8 py-24">
            <div className="h-16 w-16 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    className="text-zinc-400 icon icon-tabler icons-tabler-outline icon-tabler-file-alert"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M12 17l.01 0" />
                    <path d="M12 11l0 3" />
                </svg>
            </div>

            <h1 className="w-fit text-zinc-400 mt-16 font-light tracking-tight 2xl:text-3xl">
                Unfortunately we couldn't retrieve the content from those sources
            </h1>
            <p className="text-zinc-400 font-light tracking-tight text-sm 2xl:text-xl">
                Some websites block content extraction, which may prevent articles from being generated
            </p>
        </div>
    );
};


function ExtractionServiceDown(): JSX.Element | null {

    return (
        <div className="w-fit h-fit flex flex-col justify-center items-center gap-y-8 md:py-24">
            <div className="h-16 w-16 flex items-center justify-center text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 30 30" width="100%" height="100%"><path d="M25.983,13.342C25.988,13.228,26,13.116,26,13c0-4.418-3.582-8-8-8c-3.11,0-5.8,1.779-7.123,4.371C10.296,9.136,9.665,9,9,9 c-2.53,0-4.599,1.885-4.932,4.324C1.703,14.129,0,16.363,0,19c0,3.314,2.686,6,6,6h18c3.314,0,6-2.686,6-6 C30,16.382,28.321,14.162,25.983,13.342z M18.721,19.372c0.372,0.372,0.373,0.976,0,1.349c-0.373,0.373-0.976,0.372-1.349,0 L15,18.349l-2.372,2.372c-0.373,0.373-0.976,0.372-1.349,0c-0.372-0.372-0.373-0.976,0-1.349L13.651,17l-2.372-2.372 c-0.372-0.372-0.373-0.976,0-1.349s0.976-0.372,1.349,0L15,15.651l2.372-2.372c0.373-0.373,0.976-0.372,1.349,0 c0.372,0.372,0.373,0.976,0,1.349L16.349,17L18.721,19.372z" /></svg>

            </div>

            <h1 className="w-full text-center text-zinc-500 antialiased mt-6 text-3xl font-light tracking-tight 2xl:text-3xl">
                Article extraction service is currently down
            </h1>
            <p className="text-zinc-500 antialiased font-light text-center tracking-tight text-lg md:text-sm 2xl:text-xl text-wrap w-auto">
                You can still visit sources of each article via the 'Visit Source' button on each notification
            </p>
        </div>
    )
}