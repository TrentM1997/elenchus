import HeroImage from '@/components/React/features/LandingPage/components/HeroImage';
import Challenge from '../../features/LandingPage/components/Challenge';
import ChartingFeatures from '../../features/LandingPage/components/ChartingFeatures';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/ReduxToolKit/store';
import { getStoredPosts, searchBlueSky } from '@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useBodyLock } from '@/hooks/useBodyLock';
import { AnimatePresence } from 'framer-motion';
import ArticleExtractionToast from '../../global/modals/ArticleExtactionToast';
import type { ExtractionToast } from '../../app/App';
import LazyHydrationSection from '../../features/LandingPage/containers/LazyHydrationSection';

export default function Home({ }) {
    const posts = useSelector((state: RootState) => state.bluesky.posts);
    const [showToast, setShowToast] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    useBodyLock();

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


    useEffect(() => {
        const TOASTKEY = 'extraction-toast:v1';
        try {
            const raw: string | null = window.sessionStorage.getItem(TOASTKEY) as string ?? null;
            const parsed: ExtractionToast | null = raw ? JSON.parse(raw) as ExtractionToast : null;

            const toastTimer = window.setTimeout(() => {
                //parsed.shownToast initializes to false -> show toast on first visit
                if (parsed) {
                    setShowToast(!parsed.shownToast);
                };
            }, 500);

            return () => {
                clearTimeout(toastTimer);
            }
        } catch {
            console.error('session storage may be corrupted');
        }

    }, []);


    return (
        <section className={`flex h-auto flex-col gap-y-20 w-full grow scroll-smooth
          
         ${showToast
                ? 'pointer-events-none'
                : 'pointer-events-auto'
            }
         `}>
            <AnimatePresence>
                {showToast && <ArticleExtractionToast setShowToast={setShowToast} />}
            </AnimatePresence>

            <HeroImage />
            <ChartingFeatures />

            <Challenge />

            <LazyHydrationSection />
        </section>
    );
};


