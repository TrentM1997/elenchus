import { motion } from "framer-motion";
import { variants, softEase } from "@/motion/variants";

type Explanation = {
    number: number,
    title: string,
    description: string
};

export default function PurposePrompt(): JSX.Element {

    const points: Explanation[] = [
        {
            number: 1,
            title: 'Phase 1',
            description: `Phase 1 is where we gather your point of view onf ideas 
            and/or claims that either you yourself believe, or that you've heard from others. 
            In 4 steps we'll gather the idea you're investigating, your point of view and biases on the topic at hand, and optionally 
            break down the premises of the idea examined. By doing this, your perspective is clearly defined prior to searching for any evidence.
            Once your research has concluded, this initial perspective will be resurfaced to see if you've changed that perspective and why.`
        },
        {
            number: 2,
            title: 'Phase 2',
            description: `In this phase of the process, you'll search for evidence regarding the topic at hand, or the premises you broke down from the idea that must
            line up to validate it. The only results you can get from our search feature are published news articles, the publications of which are rated for their bias and journalistic 
            integrity by the Media Bias/Fact Check organization(MBFC). This way you have full transparency of the sources you choose. You'll have the ability to visit the origin of the article online,
            take notes, and quickly extract explanations of any unfamiliar terms within those articles.`
        },
        {
            number: 3,
            title: "Phase 3",
            description: `The third and final phase of the investigation process will be the reflection upon your initial perspective, and gathering what your perspective is after concluding your research.
            Upon completing this step you'll be presented a table highlighting what merits you found the claim to have, and whether your perspective shifted afterwards.`
        }
    ]


    return (
        <motion.div
            aria-hidden='true'
            id="prompt-overlay"
            variants={variants}
            initial={false}
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2, ease: softEase }}
            className="fixed inset-0 bg-black/60 z-20 pointer-events-auto flex items-center justify-center"
        >

            <div className="h-168 w-128 rounded-3xl border-border_gray shadow-material p-4 bg-black flex flex-col items-center justify-start gap-y-4">
                <header className="flex items-center justify-center border-b border-white/10 w-full h-auto">
                    <h1 className="text-white text-2xl font-light tracking-tight">
                        The Investigation Process
                    </h1>
                </header>
                <main className="w-full h-full flex items-center justify-center">
                    <ul className="flex flex-col items-start justify-start divide-bone_white">

                    </ul>
                </main>
            </div>
        </motion.div>
    )
}