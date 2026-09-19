import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { authenticated } from '@/state/Reducers/Athentication/Authentication';
import { populateArticles } from '@/state/Reducers/Dashboard/UserContent/UserContentReducer';
import { populateResearch } from '@/state/Reducers/Dashboard/UserContent/UserInvestigations';
import type { RecoverUserResults } from "@/env";
import { User } from '@supabase/supabase-js';


export function useRestoreSession() {
    const session = useSelector((state: RootState) => (state.auth.userKind === "authenticated"));
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        const flags = localStorage.getItem("tooltipFlags");

        if (!flags) {
            localStorage.setItem('tooltipFlags', JSON.stringify({
                readingTooltip: false,
                selectingTooltip: false
            }));
        };

        const abortController = new AbortController();

        if (session) return;

        (async () => {
            try {
                const res = await fetch('/getCurrentUser', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: abortController.signal
                });

                if (!res.ok) {
                    if (res.status === 401) throw new Error('No active session')
                    throw new Error(`Unexpected error: ${res.status}`)
                }

                const result: RecoverUserResults = await res.json();
                const user: User = result?.data?.user;
                const data: UserContent = result?.data;
                const { userArticles, userResearch } = data;

                if (user && data) {
                    dispatch(authenticated("authenticated"));
                    dispatch(populateArticles(userArticles));
                    dispatch(populateResearch(userResearch));
                };

            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.warn('Session restore failed:', error?.message || error);
                };
            };
        })();

        return () => abortController.abort();

    }, [session, dispatch]);
};
