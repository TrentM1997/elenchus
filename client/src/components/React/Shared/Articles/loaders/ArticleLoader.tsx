import Lottie from "lottie-react"
import { motion } from "framer-motion"
import vortex from '@/lotties/vortex.json'
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect, useRef, useState } from "react";

export default function ArticleLoader(): JSX.Element | null {
    const [showWaitCaution, setShowWaitCaution] = useState<boolean>(false);
    const progress: string | null = useSelector((state: RootState) => state.investigation.read.progress);
    const timeRef = useRef<number | null>(null);


    useEffect(() => {
        if (timeRef.current) return;

        timeRef.current = window.setTimeout(() => {
            setShowWaitCaution(true);
            timeRef.current = null;
        }, 12000);


        return () => {
            if (timeRef.current !== null) {
                clearTimeout(timeRef.current);
            }
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.2, delay: 0.2 } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, delay: 0 } }}
            className='w-full h-dvh mx-auto flex flex-col items-center justify-center fixed bg-black pointer-events-none overflow-hidden z-[35] inset-0 md:left-0'>

            <div className="w-auto h-auto flex flex-col items-center justify-start relative">
                <div className="w-88 lg:w-128 h-auto transition-all duration-200 ease-in-out">
                    <Lottie

                        animationData={vortex}

                        autoPlay={true}
                        loop={true}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
                <header className='w-auto h-auto mx-auto flex flex-col items-center justify-center'>
                    <h1
                        className='w-auto mx-auto h-fit text-center text-base tracking-tight md:text-3xl xl:text-3xl will-change-transform transform-gpu inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
         bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer pb-8'
                    >Gathering the chosen articles

                    </h1>

                    <ScrapeProgress progress={progress} />

                    <div className="w-full h-24 flex items-center justify-center">
                        <p className={`text-zinc-400 opacity-0 ${showWaitCaution ? 'animate-fade-blur' : ''} ease-soft font-light tracking-tight text-xs md:text-base text-center text-wrap w-4/5`}>
                            This process may take a minute or two while we extract and format each article for reading.
                        </p>
                    </div>


                </header>
            </div>
        </motion.div>
    );
};


function ScrapeProgress({ progress }: { progress: string }): JSX.Element | null {

    return (
        <div className="flex items-center justify-center p-3 w-auto h-auto rounded-lg bg-white/5">
            <p className="text-zinc-400 font-light tracking-tight text-sm">
                Progress  {progress}
            </p>
        </div>
    );
};