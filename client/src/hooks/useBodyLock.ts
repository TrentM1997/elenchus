import { RootState } from "@/state/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export function useBodyLock() {
    const isPopoverOpen = useSelector(
        (state: RootState) => state.bluesky.popoverPost.status === "ready",
    );

    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isPopoverOpen);

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isPopoverOpen])
}
