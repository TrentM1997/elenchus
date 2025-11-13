import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { grabAssociatedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { presentAssociatedArticle } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import React from "react";
import { chooseTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";



function ResearchSource({ source }) {
    const dispatch = useDispatch<AppDispatch>();

    const handleArticleSelection = () => {
        dispatch(grabAssociatedArticle(source));
        dispatch(chooseTab('Associated Article'));
    };


    return (


        <li key={source.id} className="cursor-pointer mx-auto w-full xl:px-12 xl:w-fit md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
            <div
                className="flex flex-col md:flex-row justify-between gap-12 md:gap-x-2 xl:gap-24 items-center"
                title={source.title}>
                <div className="group" onClick={handleArticleSelection}>
                    <h3

                        className="text-3xl mt-6 tracking-tight font-light md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/80 md:group-hover:text-white transition-all duration-200 ease-in-out">
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
                        className="aspect-[16/9] w-88 md:w-128 lg:w-128 xl:max-w-[25rem] xl:min-w-[25rem] rounded-3xl object-cover sm:aspect-[2/1] overflow-hidden lg:aspect-[3/2]"
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