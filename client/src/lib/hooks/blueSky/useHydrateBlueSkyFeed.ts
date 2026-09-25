import { hydrateFeed } from "@/state/Reducers/BlueSky/thunks";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useHydrateBlueSkyFeed = () => {
  const posts = useSelector((s: RootState) => s.bluesky.posts);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (posts.status === "initial") {
      const executeHydrateBlueSkyFeed = async () => {
        await dispatch(hydrateFeed());
      };

      void executeHydrateBlueSkyFeed();
    }
  }, [dispatch, posts]);

  return {
    posts,
  };
};
