import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { getStoredPosts } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { searchBlueSky } from "@/state/Reducers/BlueSky/thunks";

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