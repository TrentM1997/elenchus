import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import type { InvestigateState } from "@/state/Reducers/Root/InvestigateReducer";


interface useDebouncedPage {
    debouncedPage: any
}

interface UseDebouncedPageProps {
    delay?: number
};

export function useDebouncedPage({ delay = 120 }: UseDebouncedPageProps): useDebouncedPage {
    const investigation: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { currentPage, pages } = investigation.search;
    const [debouncedPage, setDebouncedPage] = useState<number | null>(currentPage ?? 0);

    useEffect(() => {
        if (!Array.isArray(pages) || (pages.length === 0)) return;

        const timer = window.setTimeout(() => {
            setDebouncedPage(currentPage);
        }, delay);

        return () => clearTimeout(timer);

    }, [currentPage, pages, delay]);

    return { debouncedPage: debouncedPage };
};