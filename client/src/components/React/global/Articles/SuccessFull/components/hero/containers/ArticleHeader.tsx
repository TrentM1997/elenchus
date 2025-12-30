import MoreButton from "../../../../buttons/MoreButton";
import SaveArticle from '../../../../buttons/SaveArticle';
import { useState } from "react";
import { motion } from "framer-motion";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import ArticleMetaData from "./ArticleMetaData";
import ArticleImage from "../ArticleImage";

export default function ArticleHeader({ articleData, investigating }): JSX.Element | null {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1, transition: {
                    delay: 0.2,
                    type: 'tween',
                    duration: 0.3
                }
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.1
                }
            }}
            className="border-b border-white/10"
        >
            <ScrolltoTop />
            <section
                className="flex flex-col gap-y-2 md:flex-row 
            md:gap-x-4 items-stretch w-full h-full mx-auto mb-3"
            >
                <article
                    className="w-full h-full flex flex-col gap-y-4 xl:flex-row items-start xl:items-center 2xl:items-end xl:gap-x-4 xl:gap-y-0
                justify-between self-end"
                >
                    <ArticleImage article={articleData} />
                    <ArticleMetaData article={articleData} />


                    <div
                        className="self-end w-auto h-full flex translate-y-1 xl:translate-y-0
                        flex-col gap-y-0 md:gap-y-4 items-center"
                    >
                        <div
                            className="w-auto h-auto flex justify-start"
                        >
                            {investigating && <SaveArticle
                                open={open}
                                article={articleData}

                            />}
                        </div>
                        <div className="w-auto h-auto">
                            <MoreButton
                                open={open}
                                setOpen={setOpen}
                                articleData={articleData}
                            />
                        </div>
                    </div>
                </article>
            </section>
        </motion.header>
    );
};