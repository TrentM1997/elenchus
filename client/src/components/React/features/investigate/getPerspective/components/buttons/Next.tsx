import type { RootState } from '@/ReduxToolKit/store'
import { useSelector, useDispatch } from 'react-redux'
import { increment, denyIncrement, acceptedInput, incrementBy } from "@/ReduxToolKit/Reducers/Investigate/Steps";
import { motion } from "framer-motion";
import { selectPost } from '@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice';
import { useEffect, useRef } from 'react';


export default function NextButton({ }) {
  const investigateState = useSelector((state: RootState) => state.investigation)
  const selected = useSelector((state: RootState) => state.bluesky.selected)
  const { stepper, help, pov } = investigateState
  const { step, denied } = stepper
  const { idea } = pov
  const { gettingHelp } = help
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const dispatch = useDispatch()

  const handleStep = () => {
    window.dispatchEvent(new CustomEvent('nextStepClick'))
    if (denied === false && idea !== '') {
      dispatch(increment())
      dispatch(selectPost(null))
    } else if (denied === true) {
      ;
    } else if (denied === null && selected === null || idea === '') {
      dispatch(acceptedInput(false))
      dispatch((denyIncrement(true)))
    }


  }

  useEffect(() => {

    return () => window.removeEventListener('nextStepClick', handleStep);

  }, [denied])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className={`relative h-auto w-auto justify-self-end self-center ${step >= 4 || gettingHelp ? 'pointer-events-none' : 'pointer-events-auto'}`}
    >
      <button
        onClick={handleStep}
        className="text-slate-300 text-md font-light w-14 h-10
          lg:w-14 lg:h-12 p-1.5 transition-all mx-auto flex
          duration-200 bg-ebony/70 md:hover:bg-white/10 items-center group shadow-material_2
          rounded-2xl">
        <span className="mx-auto flex items-center justify-center">
          <svg className={`p-3 ${step >= 4 ? 'text-zinc-400' : 'text-white md:group-hover:text-white'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
            <path d="M17.586,44.414C17.977,44.805,18.488,45,19,45s1.023-0.195,1.414-0.586l19-19c0.781-0.781,0.781-2.047,0-2.828l-19-19 c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828L35.172,24L17.586,41.586C16.805,42.367,16.805,43.633,17.586,44.414z" fill="currentColor" />
          </svg>
        </span>
      </button>
    </motion.div>
  )
}
