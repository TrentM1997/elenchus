import React from "react";

type FetchPriority = 'high' | 'low' | 'auto';
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchpriority?: FetchPriority;
};

export default function ToolsForResearch(): JSX.Element {
    const ImageProperties: ImgProps = {
        alt: "",
        "aria-hidden": "true",
        className: "sr-only lg:not-sr-only absolute opacity-70 -top-20 border",
        decoding: "sync",
        loading: "lazy",
        fetchpriority: "low",
        src: "/images/assets/cubeTwo.png",

    };


    return (
        <section className="lg:p-8 w-full opacity-0 animate-fade-in animation-delay-200ms ease-soft">
            <div className="mx-auto 2xl:max-w-7xl py-24 lg:px-16 md:px-12 px-8 xl:px-12 items-center lg:py-24 relative w-full">
                <div className="relative isolate lg:flex-col overflow-hidden bg-gradientdown ring-1 ring-white/10 rounded-4xl lg:flex p-3">
                    <div className="2xl:max-7xl border-zinc-800 rounded-2xl lg:rounded-3xl overflow-hidden">
                        <div className="mx-auto">
                            <div className="relative">
                                <img height={400} width={400} {...ImageProperties} />
                                {/*  <KeyboardScroller playAnimation={playAnimation} /> */}
                            </div>
                        </div>
                    </div>

                    <div className="items-center w-xl px-8 py-12 lg:py-24 mx-auto md:px-12 lg:px-16 xl:px-36 2xl:max-w-7xl">
                        <div className="text-center max-w-xl md:mx-auto">
                            <span className="text-white">Unified space for investigation</span>
                            <h2 className="text-3xl tracking-tight mt-6 font-light lg:text-4xl text-white">
                                Centralized tools
                                <span className="block text-zinc-300">for thoughtful research</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
