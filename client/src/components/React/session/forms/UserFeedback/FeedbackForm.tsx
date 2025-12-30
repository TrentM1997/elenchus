import { AnimatePresence, motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { getAuthorEmail, getFeedBackMessage, stopAskingForFeedBack } from "@/state/Reducers/Feedback/FeedbackSlice"
import React, { useEffect, useState } from "react"
import { RootState } from "@/state/store"
import { submitFeedback } from "@/services/supabase/SupabaseData"
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import type { SigninStatus } from "@/hooks/useSignIn"
import { wait } from "@/helpers/formatting/Presentation"
import { populateModal } from "@/state/Reducers/Investigate/Rendering"
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice"

export default function FeedBackForm() {
  const activeSession = useSelector((state: RootState) => state.auth.activeSession);
  const authorEmail = useSelector((state: RootState) => state.feedback.authorEmail)
  const message = useSelector((state: RootState) => state.feedback.message)
  const [needInput, setNeedInput] = useState<boolean>(null)
  const [feedbackSubmitted, setFeedbacksubmitted] = useState<boolean>(null);
  const [status, setStatus] = useState<SigninStatus>('idle');
  const dispatch = useDispatch()

  const closeFeedback = () => {
    dispatch(renderModal(null));
    dispatch(stopAskingForFeedBack(true))
  };

  const getEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target.value;
    dispatch(getAuthorEmail(target))
  }

  const getMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target.value;
    console.log(target)
    dispatch(getFeedBackMessage(target))
  }





  useEffect(() => {
    if (status === 'idle') return;

    const executeFeedback = async () => {
      const data = await submitFeedback(authorEmail, message)
      if (data) {
        setStatus('success');
        setFeedbacksubmitted(true)
      } else {
        setFeedbacksubmitted(false)
        setStatus('failed')
      };

      await wait(1500);
      dispatch(populateModal(null));
    }

    executeFeedback();
  }, [status, feedbackSubmitted])


  useEffect(() => {


    return () => {
      dispatch(getAuthorEmail(null));
      dispatch(getFeedBackMessage(null));
    }
  }, []);



  return (

    <div className="relative md:max-w-168 flex max-w-80 mx-auto mt-20 lg:mt-32 opacity-0 animate-fade-blur animation-delay-400ms
      flex-col items-center shadow-material rounded-xl md:rounded-3xl bg-gradient-to-tr from-ebony to-mirage p-8">
      <div onClick={closeFeedback}
        className="w-fit rounded-full p-1.5 md:hover:bg-white/10 transition-all 
        duration-200 ease-in-out h-fit flex justify-end absolute top-2 right-2 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={16} height={16} viewBox="0,0,256,256">
          <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth={1} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10} strokeDasharray="" strokeDashoffset={0} fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><g transform="scale(16,16)"><path d="M2.75,2.04297l-0.70703,0.70703l0.35547,0.35156l4.89453,4.89844l-5.25,5.25l0.70703,0.70703l5.25,-5.25l4.89453,4.89844l0.35547,0.35156l0.70703,-0.70703l-0.35156,-0.35547l-4.89844,-4.89453l5.25,-5.25l-0.70703,-0.70703l-5.25,5.25l-4.89844,-4.89453z" /></g></g>
        </svg>
        <AnimatePresence>
          {(status !== 'idle') && <AuthNotification action="Feedback" setStatus={setStatus} status={status} />}
        </AnimatePresence>
      </div>
      <h2 className="title-font mb-1 text-lg lg:text-2xl font-light font-serif tracking-tight text-center text-white">Feedback</h2>
      <p className="mb-5 w-auto md:w-2/3 font-light text-wrap text-center mx-auto leading-relaxed text-zinc-400">If you had any issues or you liked our product, please share
        with us!
      </p>
      {!activeSession && <div className="mb-4 w-full">
        <label htmlFor="email" className="text-sm leading-7 text-zinc-400">Email</label>
        <input onChange={(e) => getEmail(e)} type="email" id="email" name="email"
          placeholder="youremail@example.com"
          className="block w-full px-3 py-3 border md:border-2 rounded-lg appearance-none text-white placeholder-black/50 bg-mirage focus:bg-black
    focus:outline-none focus:border-zinc-400 focus:ring-0 text-base sm:text-sm placeholder-zinc-500 h-10 relative prose-styles" />
      </div>}
      <div className="mb-4 w-full">
        <label htmlFor="message" className="text-sm leading-7 text-zinc-400">Message</label>

        <textarea onChange={(e) => getMessage(e)} placeholder="Let us know what you enjoyed, and what we can improve!" id="message" name="message"
          className="h-32 lg:h-40 w-full resize-none px-2 py-2 border md:border-2 rounded-lg appearance-none text-white placeholder-black/50 bg-mirage focus:bg-black
    focus:outline-none focus:border-zinc-400 focus:ring-0 text-base sm:text-sm placeholder-zinc-500 relative prose-styles" defaultValue={""} />
        {needInput && <label htmlFor="message" className="text-xs leading-7 text-red-500 ml-2">Please fill email and message fields to submit!</label>}
      </div>
      <button onClick={() => setStatus('pending')} type="button" className="rounded-full border-0 bg-white text-black py-1 px-6 text-base font-light transition-all duration-200 ease-in-out sm:hover:text-white  sm:hover:bg-mirage focus:outline-none">Send</button>
    </div>
  );
};