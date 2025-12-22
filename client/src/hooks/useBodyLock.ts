import { RootState } from "@/state/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";


export function useBodyLock() {
    const popoverPost = useSelector((state: RootState) => state.bluesky.popoverPost);
    const prevStyles = useRef<{ pos: string; top: string; width: string; pr: string }>();

    useEffect(() => {
        if (!popoverPost) {
            document.body.classList.remove('overflow-hidden');
            return;
        };

        if (popoverPost) {
            document.body.classList.add('overflow-hidden');

        }


    }, [popoverPost])
} 