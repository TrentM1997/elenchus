import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { renderGuideTip } from "@/state/Reducers/Overlay/PipelineSlice";

interface SelectionRequired {
  count: number;
}

export default function SelectionRequired({
  count,
}: SelectionRequired): React.ReactPortal {
  const dispatch = useDispatch();
  const max = 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(renderGuideTip(null));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const variants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  };

  const modal = (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.3, ease: [0.33, 0, 0.67, 1] }}
      className="fixed inset-0 pointer-events-auto z-[900]"
    >
      <div
        className="absolute bottom-24 2xl:right-16 bg-slate-100
            w-72 h-40 p-3  rounded-lg flex flex-col items-center
        border border-astro_gray shadow-material"
      >
        <div className="w-full flex flex-col gap-y-4 items-start justify-start h-auto p-2">
          <h1 className="text-black text-wrap text-base w-full font-light tracking-tight">
            Select at least one article to retrieve content!
          </h1>

          <h2 className="text-black text-wrap text-base w-full font-light tracking-tight">
            Current Selection: {`${count}/${max}`}
          </h2>
        </div>
      </div>
    </motion.div>
  );

  return createPortal(modal, document.body);
}
