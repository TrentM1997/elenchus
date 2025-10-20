import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { displaySearch, displayMindMap } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer"
import { RootState } from "@/ReduxToolKit/store"
import { variants } from "@/motion/variants"
import PromptForSearch from "../inputs/prompts/PromptForSearch"
import React from "react"

function Step5(): JSX.Element | null {
    const dispatch = useDispatch()

    const beginSearch = () => {
        dispatch(displayMindMap(false))
        dispatch(displaySearch(true))
    };

    return (
        <motion.div
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2 }}
            className='absolute inset-0
            flex items-center justify-start basis-full'>
            <div className="block w-full max-w-full mx-auto h-full no-scrollbar">
                <div className="w-full h-full mx-auto flex flex-col items-start justify-start box-border">

                    <main className="w-full md:w-fit h-auto 
                    min-h-32 2xl:min-h-40 flex flex-col 
                    justify-start items-start md:justify-center
                    gap-y-5 sm:gap-y-12 my-auto"
                    >
                        <PromptForSearch />

                        <div className="w-fit h-auto">
                            <button
                                onClick={beginSearch}
                                className="bg-white hover:bg-white/10 rounded-full group 2xl:-translate-x-1 mb-2 sm:mb-0
                            w-32 h-8 xl:w-44 xl:h-10 mx-auto flex items-center 
                            text-center transition-all duration-300 ease-soft shadow-sm">
                                <div className="w-full h-full flex justify-between items-center">
                                    <div className="w-auto h-auto mx-auto">
                                        <p className="text-black group-hover:text-white font-light text-sm text-center xl:text-lg w-fit">
                                            Get Started <span className="ml-2">&#8594;</span>
                                        </p>
                                    </div>
                                </div>

                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(Step5);


