import { Link } from "react-router-dom";
import React from "react";
import Circuitry from "./Circuitry";

function Challenge() {

    return (
        <section className="lg:p-8 p-4 opacity-0 animate-fade-blur animation-delay-200ms ease-soft">
            <div className="px-8 py-12 lg:py-24 mx-auto md:px-12 lg:px-16 xl:px-36 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-24 items-center">
                    <div>
                        <span className="text-blue-400"> Investigate</span>
                        <h2 className="text-3xl mt-6 tracking-tight font-light lg:text-4xl text-white">
                            Challenge a perspective
                            <span className="block text-zinc-400">web together ideas</span>
                        </h2>
                        <p className="mt-4 text-base text-white text-balance">
                            When was the last time something invoked a sense of frustration,
                            passion or skepticism that came across your path?
                        </p>
                        <p className="mt-4 text-base text-zinc-400 text-balance">
                            From the top down visualize your entire thought process,
                            establishing what you believe and why
                        </p>
                        <div className="inline-flex flex-wrap items-center mt-8">
                            <div className="text-sm py-2 px-4 border focus:ring-2 rounded-full border-transparent 
                            bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white 
                            hover:text-white inline-flex items-center justify-center ring-1 ring-transparent cursor-pointer">
                                <Link to='/Investigate'> Get started &nbsp; →</Link>

                            </div>
                        </div>
                    </div>
                    <div className="h-72 w-72 md:h-auto md:w-auto">
                        <Circuitry />
                    </div>
                </div>
            </div>
        </section>
    )
};


export default React.memo(Challenge);


