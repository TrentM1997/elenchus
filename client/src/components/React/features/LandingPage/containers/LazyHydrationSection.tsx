import { lazy, Suspense, useEffect } from 'react'
import { useState, useRef } from 'react';
import ToolsForResearch from '../components/Keyboard';
import BlueSkySkeleton from '../../blueSky/skeletons/BlueSkySkeleton';
import WikiAndNotes from '../components/WikiAndNotes';
import { useSelector } from 'react-redux';
import { RootState } from '@/ReduxToolKit/store';
const BlueSkyPosts = lazy(() => import('@/components/React/features/blueSky/Containers/BlueSky'));
import React from 'react';
import DelayedFallback from '@/components/React/Shared/fallbacks/DelayedFallback';

function LazyHydrationSection() {
    const [showBlueSky, setShowBlueSky] = useState<boolean>(false);
    const [playAnimation, setPlayAnimation] = useState<boolean>(false);
    const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
    const popoverPost = useSelector((state: RootState) => state.bluesky.popoverPost);
    const sentinelRef = useRef(null);
    const animationTriggerRef = useRef(null);
    const feedRef = useRef(null);


    //TODO: finish fixing scroll jank


    useEffect(() => {
        if ((showBlueSky) || (!sentinelRef.current)) return;

        const observer = new IntersectionObserver(([entry]) => {

            if (entry.isIntersecting) {
                setShowBlueSky(true);
                observer.disconnect();
            }
        },
            { rootMargin: '400px' }
        );
        observer.observe(sentinelRef.current);

        return () => {
            observer.disconnect();
        };
    }, [showBlueSky]);


    useEffect(() => {
        if ((playAnimation) || (!animationTriggerRef.current)) return;

        const animationObserver = new IntersectionObserver(([entry]) => {

            if (entry.isIntersecting) {
                setPlayAnimation(true);
                animationObserver.disconnect();
            }
        },
            { rootMargin: '400px' }
        );
        animationObserver.observe(animationTriggerRef.current);

        return () => {
            animationObserver.disconnect();
        }
    }, [playAnimation]);

    useEffect(() => {
        if (!feedRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setShouldAnimate(entry.isIntersecting);
        }, { rootMargin: '300px' });

        observer.observe(feedRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            aria-label='animated components'
            className={`w-full h-auto z-20
        ${popoverPost ? 'overflow-y-hidden' : ''}
        `}>
            <div
                ref={animationTriggerRef}
                className='h-1 w-full' />

            <ToolsForResearch playAnimation={playAnimation} />

            <WikiAndNotes />

            <div ref={sentinelRef} className='h-1 w-full' />
            <div ref={feedRef} className='h-1 w-full' />

            {showBlueSky &&
                <Suspense fallback={<DelayedFallback><BlueSkySkeleton context='home' /></DelayedFallback>}>
                    {showBlueSky && <BlueSkyPosts shouldAnimate={shouldAnimate} context='home' />}
                </Suspense>
            }


        </section>
    )
};


export default React.memo(LazyHydrationSection);