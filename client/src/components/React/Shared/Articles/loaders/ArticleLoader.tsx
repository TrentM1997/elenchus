import Lottie from "lottie-react"
import { motion } from "framer-motion"
import vortex from '@/lotties/vortex.json'


export default function ArticleLoader(): JSX.Element | null {

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
                <header className='w-auto h-fit mx-auto justify-center'>
                    <h1
                        className='w-auto h-fit text-center text-base tracking-tight md:text-3xl xl:text-3xl inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
         bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer'
                    >Gathering the chosen articles

                    </h1>
                </header>
            </div>



        </motion.div>
    );
}