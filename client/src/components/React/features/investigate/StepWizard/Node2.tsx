import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { incrementBy, denyIncrement, acceptedInput } from "@/ReduxToolKit/Reducers/Investigate/Steps";
import { RootState } from "@/ReduxToolKit/store";

export default function ({ }) {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { stepper } = investigateState
    const { step, denied, acceptInput } = stepper
    const currentStep = step
    const dispatch = useDispatch()

    const selectStep = (dnd: boolean) => {

        if (dnd === false && acceptInput === true) {
            dispatch(incrementBy(1));
        } else if (dnd === null || dnd === true) {
            dispatch(denyIncrement(true));
            dispatch(acceptedInput(false));
            alert('First input field is required!')
        }
    };

    return (
        <li className="flex flex-col w-full h-20 items-center">
            <div className="flex  items-center justify-center w-full h-full relative">
                <motion.div
                    onClick={() => selectStep(denied)}
                    className="flex items-center justify-center rounded-full max-w-7 max-h-7
                      sm:max-w-9 sm:max-h-9 sm:p-1  shrink-0 z-10 hover:cursor-pointer transition-all duration-300 hover:scale-110"
                    animate={{
                        backgroundColor: currentStep >= 2 ? "#2563eb" : "#374151",
                        boxShadow: currentStep === 1
                            ? "0 0 0 4px rgba(37, 99, 235, 1)"
                            : "none"
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: 'left' }}
                >
                    <svg className="h-full w-full xs:p-1 box-border" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="100%" height="100%" fillRule="nonzero"><g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth={1} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10} strokeDasharray="" strokeDashoffset={0} fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><g transform="scale(5.12,5.12)"><path d="M23,0c-7.22656,0 -12.55469,2.49609 -16,6.40625c-3.44531,3.91016 -5,9.15234 -5,14.59375c0,4.40625 1.375,8.51563 3.6875,11.875c2.09375,3.04688 3.3125,6.63281 3.3125,10.3125v6.8125h2v-6.8125c0,-4.08594 -1.35937,-8.04297 -3.625,-11.375l-0.0625,-0.09375c-2.08984,-3.03906 -3.3125,-6.72656 -3.3125,-10.71875c0,-5.05859 1.44531,-9.81641 4.5,-13.28125c3.05469,-3.46484 7.72656,-5.71875 14.5,-5.71875c6.80078,0 11.21484,1.97266 14.125,5c2.91016,3.02734 4.33984,7.20703 4.875,11.71875l0.03125,0.21875l0.09375,0.15625l4.71875,8.09375h-0.03125c0.25,0.44922 0.125,0.88281 -0.3125,1.125v0.03125l-4.5,2.25v6c0,3.74219 -3.08594,6.66016 -6.8125,6.3125h-0.03125l-3.09375,-0.21875l-1.0625,-0.0625v7.375h2v-5.25l2,0.15625c0.01172,0 0.01953,0 0.03125,0c4.85938,0.43359 8.96875,-3.46484 8.96875,-8.3125v-4.78125l3.4375,-1.71875h0.03125l0.03125,-0.03125c1.36328,-0.75781 1.8125,-2.49219 1.0625,-3.84375v-0.03125l-4.625,-8c-0.59375,-4.68359 -2.12891,-9.18359 -5.375,-12.5625c-3.31641,-3.44922 -8.36328,-5.625 -15.5625,-5.625zM19.65625,6l-0.15625,0.84375l-0.5,2.96875c-0.46484,0.14063 -0.91406,0.33594 -1.34375,0.5625l-2.46875,-1.78125l-0.6875,-0.5l-0.59375,0.59375l-2.125,2.09375l-0.59375,0.625l0.5,0.6875l1.78125,2.46875c-0.21094,0.40625 -0.39844,0.85547 -0.5625,1.34375l-3.09375,0.625l-0.8125,0.15625v4.65625l0.84375,0.15625l2.96875,0.5c0.16406,0.48828 0.35156,0.9375 0.5625,1.34375l-1.78125,2.46875l-0.5,0.6875l0.59375,0.59375l2.09375,2.125l0.625,0.59375l0.6875,-0.5l2.46875,-1.78125c0.40625,0.21094 0.85547,0.39844 1.34375,0.5625l0.5,2.96875l0.15625,0.84375h4.6875l0.125,-0.84375l0.53125,-3.0625c0.46875,-0.16797 0.91797,-0.35156 1.34375,-0.5625l2.5625,1.78125l0.6875,0.46875l0.59375,-0.59375l2.125,-2.09375l0.59375,-0.59375l-0.5,-0.6875l-1.78125,-2.46875c0.20703,-0.39844 0.39844,-0.83594 0.5625,-1.3125l3.03125,-0.4375l0.875,-0.125v-4.71875l-0.84375,-0.15625l-3.0625,-0.5c-0.14453,-0.45312 -0.32812,-0.91406 -0.5625,-1.375l1.78125,-2.5625l0.5,-0.6875l-0.59375,-0.59375l-2.125,-2.09375l-0.59375,-0.59375l-0.6875,0.5l-2.46875,1.78125c-0.40625,-0.21094 -0.85547,-0.39844 -1.34375,-0.5625l-0.5,-2.96875l-0.15625,-0.84375zM21.34375,8h1.3125l0.46875,2.65625l0.09375,0.6875l0.65625,0.125c0.74609,0.16406 1.46094,0.52734 2.125,0.90625l0.5625,0.3125l0.53125,-0.375l2.21875,-1.59375l0.875,0.90625l-1.59375,2.3125l-0.40625,0.53125l0.375,0.5625c0.4375,0.69922 0.69531,1.40234 0.875,2.125l0.15625,0.625l0.65625,0.09375l2.75,0.46875v1.28125l-3.4375,0.46875l-0.125,0.6875c-0.16406,0.74609 -0.52734,1.46094 -0.90625,2.125l-0.3125,0.5625l0.375,0.53125l1.59375,2.1875l-0.90625,0.90625l-2.3125,-1.625l-0.46875,-0.34375l-0.5625,0.28125c-0.80078,0.39844 -1.53906,0.77734 -2.1875,0.9375l-0.625,0.15625l-0.125,0.625l-0.46875,2.78125h-1.28125l-0.46875,-2.6875l-0.09375,-0.65625l-0.65625,-0.125c-0.74609,-0.16406 -1.46094,-0.52734 -2.125,-0.90625l-0.5625,-0.3125l-0.53125,0.375l-2.1875,1.59375l-0.90625,-0.875l1.59375,-2.21875l0.375,-0.53125l-0.3125,-0.5625c-0.37891,-0.66406 -0.74219,-1.37891 -0.90625,-2.125l-0.125,-0.65625l-0.6875,-0.09375l-2.65625,-0.46875v-1.34375l2.78125,-0.53125l0.65625,-0.125l0.125,-0.625c0.16406,-0.74609 0.52734,-1.46094 0.90625,-2.125l0.3125,-0.5625l-0.375,-0.53125l-1.59375,-2.1875l0.875,-0.90625l2.21875,1.59375l0.59375,0.40625l0.59375,-0.40625c0.5625,-0.40234 1.21484,-0.66406 2.03125,-0.84375l0.65625,-0.125l0.09375,-0.6875zM22,14c-2.74609,0 -5,2.25391 -5,5c0,2.74609 2.25391,5 5,5c2.74609,0 5,-2.25391 5,-5c0,-2.74609 -2.25391,-5 -5,-5zM22,16c1.65625,0 3,1.34375 3,3c0,1.65625 -1.34375,3 -3,3c-1.65625,0 -3,-1.34375 -3,-3c0,-1.65625 1.34375,-3 3,-3z" /></g></g></svg>


                </motion.div>
                <motion.div
                    className="w-full h-1 grow"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, backgroundColor: currentStep > 1 ? "#2563eb" : "#374151" }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: 'left' }}
                />
            </div>
            <motion.div
                className="left-0 text-[0.6rem] sm:text-sm text-left bg-transparent
            text-white self-start w-fit xl:ml-2"
                animate={{ scale: 1, opacity: currentStep == 1 ? 1 : 0 }}
                transition={{ duration: 0.7 }}
            >
                2. POV
            </motion.div>

        </li>
    )
}