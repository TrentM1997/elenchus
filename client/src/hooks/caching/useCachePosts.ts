import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/ReduxToolKit/store";
import { useEffect } from "react";
import { getStoredPosts, searchBlueSky } from "@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice";

const useCachePosts = (): void => {
    const posts = useSelector((state: RootState) => state.bluesky.posts);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        const stored = localStorage.getItem('bsPosts');

        if (stored && !posts) {
            const parsed = JSON.parse(stored);
            dispatch(getStoredPosts(parsed))
        } else if (!stored && !posts) {
            dispatch(searchBlueSky("morning"));
        };

        return () => {
        }
    }, []);
};


export { useCachePosts };