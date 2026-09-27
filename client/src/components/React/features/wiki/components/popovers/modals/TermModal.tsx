import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getWikiExtract } from "@/state/Reducers/Investigate/wiki/thunks";
import { modalStages } from "@/state/Reducers/Investigate/wiki/WikiSlice";
import { useState } from "react";

export default function TermModal(): JSX.Element | null {
    const wikiModalStages = useSelector((s: RootState) => s.investigation.wiki.wikiModalStages);
    const [inputText, setInputText] = useState<string | null>(wikiModalStages.text ?? null);
    const dispatch = useDispatch<AppDispatch>();

    const retrieveWikiExtract = () => {
        dispatch(getWikiExtract(inputText));
        dispatch(modalStages({
            display: true,
            highlight: false,
            confirmExtract: false,
            text: null
        }));
    };


    const handleDeny = () => {
        dispatch(modalStages({
            display: true,
            highlight: true,
            confirmExtract: false,
            text: null
        }));
    };

    const update = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target: string | null = e.currentTarget.value;
        if (target !== null) {
            setInputText(target);
        };
    };



    return (
        <motion.div
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
            className="w-full max-w-md rounded-3xl bg-[#18191c] border border-white/10 p-6 sm:p-8 shadow-2xl
            flex items-center justify-center"
        >
            <div className="w-full flex flex-col">
                <header className="w-full text-left">
                    <label htmlFor="wiki-lookup-term" className="block text-lg text-zinc-100 font-light tracking-tight">Look up on Wikipedia</label>
                    <input
                        id="wiki-lookup-term" onChange={(e) => update(e)}
                        type="text" value={inputText ?? ""} className="w-full text-sm text-zinc-200 mt-5 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 focus:ring-1 focus:ring-white/30">

                    </input>
                    <p className="mx-auto text-sm text-white" />
                </header>

                <div className="grid grid-cols-2 gap-3 mt-6 w-full">
                    <button
                        onClick={retrieveWikiExtract}
                        type="button"
                        className="rounded-xl bg-zinc-200 px-4 py-2.5 text-sm text-zinc-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                        Look up
                    </button>
                    <button onClick={handleDeny} type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                        Cancel
                    </button>
                </div>
            </div>
        </motion.div>
    )
}