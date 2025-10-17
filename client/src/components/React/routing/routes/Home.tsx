import HeroImage from '@/components/React/features/LandingPage/components/HeroImage';
import Challenge from '../../features/LandingPage/components/Challenge';
import ChartingFeatures from '../../features/LandingPage/components/ChartingFeatures';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/ReduxToolKit/store';
import SignOutModal from '../../session/forms/AuthForms/SignOutModal';
import AnimationWrapper from '../../features/LandingPage/containers/LazyHydrationSection';
import { getStoredPosts, searchBlueSky } from '@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useBodyLock } from '@/hooks/useBodyLock';
import { AnimatePresence } from 'framer-motion';
import ArticleExtractionToast from '../../Shared/modals/ArticleExtactionToast';
import type { ExtractionToast } from '../../app/App';
import LazyHydrationSection from '../../features/LandingPage/containers/LazyHydrationSection';

export default function Home({ }) {
    const signingOut = useSelector((state: RootState) => state.auth.signOut);
    const popoverPost = useSelector((state: RootState) => state.bluesky.popoverPost);
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
    }, []);


    useEffect(() => {
        const TOASTKEY = 'extraction-toast:v1';
        try {
            const raw: string | null = window.sessionStorage.getItem(TOASTKEY) as string ?? null;
            const parsed: ExtractionToast | null = raw ? JSON.parse(raw) as ExtractionToast : null;
            //parsed.shownToast initializes to false -> show toast on first visit
            setShowToast(!parsed.shownToast);
        } catch {
            console.error('session storage may be corrupted');
        }

    }, [])


    return (
        <section className={`flex h-auto flex-col w-full grow transition-opacity duration-200 delay-200 ease-in-out scroll-smooth thin-gray-scrollbar
         ${signingOut || popoverPost
                ? 'opacity-50 pointer-events-none'
                : 'opacity-100 pointer-events-auto'
            }
         ${showToast
                ? 'pointer-events-none'
                : 'pointer-events-auto'
            }
         `}>
            {signingOut &&
                <SignOutModal />
            }
            <AnimatePresence>
                {showToast && <ArticleExtractionToast setShowToast={setShowToast} />}
            </AnimatePresence>

            <HeroImage />
            <Challenge />
            <ChartingFeatures />
            <LazyHydrationSection />
        </section>
    );
};


