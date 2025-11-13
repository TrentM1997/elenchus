import { RootState } from '@/ReduxToolKit/store';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ComponentLoader from '@/components/React/Shared/Loaders/ComponentLoader';
import { AnimatePresence } from 'framer-motion';
import InputOptions from '@/components/React/features/investigate/phase1/components/paths/InputOptions';
const BlueSkyPosts = lazy(() => import('@/components/React/features/blueSky/Containers/BlueSky'));
import HeroContainer from '@/components/React/features/investigate/shared/containers/HeroContainer';
const Content = lazy(() => import('@/components/React/features/investigate/shared/containers/Content'));
import Notes from '@/components/React/features/investigate/notes/Notes';
import BlueSkySkeleton from '@/components/React/features/blueSky/skeletons/BlueSkySkeleton';
import PanelContainer from "@/components/React/features/investigate/phase3/controls/containers/PanelContainer";
import DelayedFallback from '../../Shared/fallbacks/DelayedFallback';
import type { Phase, PathSelected } from '@/ReduxToolKit/Reducers/Investigate/Rendering';

export default function InvestigationWorkSpace() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const path: PathSelected = useSelector((s: RootState) => s.investigation.rendering.path);
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);
    const notesRef = useRef(null);
    const containerRef = useRef(null);
    const [notePosition, setNotePosition] = useState({ x: 20, y: 200 });
    const [constraints, setConstraints] = useState(null);

    function handleDragConstraints() {
        if (!containerRef.current || !notesRef.current) return;

        const constraintsRect = containerRef.current.getBoundingClientRect();
        const notesRect = notesRef.current.getBoundingClientRect();
        setConstraints({
            top: 0,
            left: 0,
            right: constraintsRect.width - notesRect.width,
            bottom: constraintsRect.height - notesRect.height
        });
    };

    useEffect(() => {
        if (containerRef.current && notesRef.current) handleDragConstraints();
    }, []);


    return (
        <section
            ref={containerRef}
            id='workspace'
            className={`w-full h-auto flex flex-col grow
            justify-start items-center transition-opacity duration-200`}
        >
            {
                (phase === 'Initial')
                && (path === null)
                && <InputOptions
                    key='input-options'
                />
            }

            {(phase === 'Initial')
                && (path === 'BlueSky Feed')
                && <Suspense
                    fallback={
                        <DelayedFallback key={'bluesky-boundary'}>
                            <BlueSkySkeleton context={'investigate'} />
                        </DelayedFallback>
                    }>
                    <BlueSkyPosts key='bluesky-feed' context={'investigate'} />
                </Suspense>
            }
            {(phase !== 'Initial') &&
                <HeroContainer
                    key={'HeroContainer'} />
            }
            <Suspense
                key={'content-container'}
                fallback={
                    <DelayedFallback
                        key='content-boundary'
                        delay={300}
                    >
                        <ComponentLoader key='loader-spinner' />
                    </DelayedFallback>}
            >
                {(phase === 'Phase 2' || phase === 'Phase 3')
                    && <Content key='article-content'
                    />
                }
            </Suspense>

            <PanelContainer
                key='control-panel-container' />

            <AnimatePresence>
                {takingNotes &&
                    <Notes
                        key={'notepad'}
                        notesRef={notesRef}
                        constraints={constraints}
                        notePosition={notePosition}
                        setNotePosition={setNotePosition}
                    />
                }
            </AnimatePresence>

        </section>
    );
};