import { AppDispatch, RootState } from "@/ReduxToolKit/store"
import { useDispatch, useSelector } from "react-redux"
import { getModalPosition, modalStages } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import { AnimatePresence } from "framer-motion";
import TermModalContainer from "@/components/React/features/WikiExtract/components/popovers/containers/TermModalContainer";
import TermModal from "@/components/React/features/WikiExtract/components/popovers/modals/TermModal";
import WikiTermExtract from "@/components/React/features/WikiExtract/components/WikiTermExtract";
import ArticleBody from "./ArticleBody";
import { useIsMobile } from "@/hooks/useIsMobile";

interface FullTextProps {
    article_text: string,
    article_url: string
};


//TODO: ensure that in mobile view, the user is prompted with the lookup modal, not the modal meant for desktop view w/tooltips 

export default function FullText({ article_text, article_url }: FullTextProps) {
    const investigateState = useSelector((state: RootState) => state.investigation);
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useIsMobile();
    const { wikiModalStages } = investigateState.wiki;


    const handleHighlightStart = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wikiModalStages.highlight) {
            return
        } else {
            const x: number = e.pageX;
            const y: number = e.pageY;

            dispatch(getModalPosition({ x, y }));
        };
    };

    const handleHighlightEnd = () => {
        if (wikiModalStages.highlight) {
            const selection = window.getSelection();

            if (selection && selection.rangeCount > 0) {
                const selectedTextString = selection.toString().trim();
                selectedTextString.length > 3
                    && dispatch(modalStages({
                        display: true,
                        highlight: false,
                        confirmExtract: true,
                        text: selectedTextString
                    }));
            };
        };
    };


    return (
        <div
            onMouseDown={(e) => handleHighlightStart(e)}
            onMouseUp={handleHighlightEnd}
            className={`pt-6 text-white w-full h-full xl:text-xl tracking-tight relative 
                leading-6 md:leading-6 whitespace-pre-wrap  pb-16 transition-all duration-1000 ease-in-out
                selection:bg-blue-300 selection:text-black`}
        >
            {wikiModalStages.text &&
                wikiModalStages.confirmExtract &&
                <TermModalContainer>
                    <TermModal />
                </TermModalContainer>}

            <AnimatePresence>
                {wikiModalStages.display && <WikiTermExtract article_url={article_url} />}
            </AnimatePresence>
            <ArticleBody markdown={article_text} />
        </div>
    )
};