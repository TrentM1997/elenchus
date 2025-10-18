import { useTransition, useEffect, useState } from "react";
import { useDebouncedPage } from "./useDebouncePage";

interface TransitionedIndex {
    isPending: boolean,
    displayed: number
};

interface TransitionedIndexProps {
    currentPage?: number
}

export function useTransitionedIndex({ }: TransitionedIndexProps): TransitionedIndex {
    const { debouncedPage } = useDebouncedPage({ delay: 200 });
    const [isPending, startTransition] = useTransition();
    const [displayed, setDisplayed] = useState<number>(debouncedPage ?? 0);


    useEffect(() => {

        startTransition(() => setDisplayed(debouncedPage));
    }, [debouncedPage, startTransition]);

    return { displayed, isPending };

};