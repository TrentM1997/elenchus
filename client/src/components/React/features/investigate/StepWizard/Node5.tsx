import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { incrementBy } from "@/ReduxToolKit/Reducers/Investigate/Steps";
import { RootState } from "@/ReduxToolKit/store";

export default function Node5({ }) {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { stepper } = investigateState
    const { step } = stepper
    const currentStep = step
    const dispatch = useDispatch()


    return (
        <li className="flex flex-col w-fit h-20 items-center">
            <div className="flex items-center h-full w-full">
                <motion.div
                    onClick={() => dispatch(incrementBy(4))}
                    className="flex items-center justify-center rounded-full max-w-7 max-h-7 
                    sm:max-w-9 sm:max-h-9 sm:p-1
                    shrink-0 z-10 hover:cursor-pointer transition-all duration-300 hover:scale-110"
                    animate={{
                        backgroundColor: currentStep === 4 ? "#2563eb" : "#374151",
                        boxShadow: currentStep === 4
                            ? "0 0 0 4px rgba(37, 99, 235, 1)"
                            : "none"
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: 'left' }}>
                    <svg className="xs:p-1 lg:p-1.5 box-border" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><path d="M 20.5 6 C 12.509634 6 6 12.50964 6 20.5 C 6 28.49036 12.509634 35 20.5 35 C 23.956359 35 27.133709 33.779044 29.628906 31.75 L 39.439453 41.560547 A 1.50015 1.50015 0 1 0 41.560547 39.439453 L 31.75 29.628906 C 33.779044 27.133709 35 23.956357 35 20.5 C 35 12.50964 28.490366 6 20.5 6 z M 20.5 9 C 26.869047 9 32 14.130957 32 20.5 C 32 23.602612 30.776198 26.405717 28.791016 28.470703 A 1.50015 1.50015 0 0 0 28.470703 28.791016 C 26.405717 30.776199 23.602614 32 20.5 32 C 14.130953 32 9 26.869043 9 20.5 C 9 14.130957 14.130953 9 20.5 9 z" fill="#FFFFFF" /></svg>

                </motion.div>
            </div>


            <motion.div
                className="md:text-sm xs:text-xs text-left text-white w-full"
                animate={{ opacity: currentStep == 4 ? 1 : 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="w-fit text-[0.6rem] sm:text-sm text-left text-nowrap">5. Search</div>
            </motion.div>

        </li>
    )
}