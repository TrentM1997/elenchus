import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { readSavedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { presentThisArticle } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import React from "react";



function ResearchSource({ source }) {
    const dispatch = useDispatch<AppDispatch>();

    const handleArticleSelection = () => {
        dispatch(readSavedArticle(source));
        dispatch(presentThisArticle());
    };


    return (


        <li key={source.id} className="cursor-pointer mx-auto w-fit lg:max-w-6xl xl:max-w-7xl">
            <div
                className="flex flex-col md:flex-row justify-between gap-12 lg:gap-24 items-center"
                title={source.title}>
                <div className="group" onClick={handleArticleSelection}>
                    <h3

                        className="text-3xl mt-6 tracking-tight font-light lg:text-4xl text-white/80 md:group-hover:text-white transition-all duration-200 ease-in-out">
                        {source.title}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-6">
                        {source.authors ? source.authors[0] : 'Authors not available'} - <span> <time
                            className="text-zinc-400 md:group-hover:text-blue-400 transition-all ease-in-out duration-200" dateTime={source.date_published}>{source.date_published}</time>
                        </span>
                    </p>
                    <p className="text-zinc-400 text-xs mt-6">
                        Published by - <span className="text-zinc-400 md:group-hover:text-blue-400 transition-all ease-in-out duration-200">{source.provider} </span>
                    </p>
                </div>
                <div className="w-auto">
                    <img
                        className="aspect-[16/9] w-88 lg:w-112 xl:max-w-[26rem] xl:min-w-[26rem] rounded-3xl object-cover sm:aspect-[2/1] overflow-hidden lg:aspect-[3/2]"
                        width="560"
                        height="380"
                        src={source.image_url}
                    />
                </div>

            </div>
        </li>
    )
};


export default React.memo(ResearchSource);