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
import React from 'react';
import type { ContentStatus } from '@/ReduxToolKit/Reducers/Investigate/DisplayReducer';

function InvestigationWorkSpace() {
    const showOptions = useSelector((s: RootState) => s.investigation.pov.showOptions);
    const idea = useSelector((s: RootState) => s.investigation.pov.idea);
    const takingNotes = useSelector((s: RootState) => s.investigation.notes.takingNotes);
    const showBlueSkySearch = useSelector((s: RootState) => s.investigation.display.showBlueSkySearch);
    const contentStatus: ContentStatus = useSelector((s: RootState) => s.investigation.display.contentContainer);
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
            justify-start items-center transition-opacity duration-200 
            
            `}
        >

            {!idea && showOptions &&
                <InputOptions key='input-options' />
            }

            {showBlueSkySearch === false && (showOptions === false) &&
                <HeroContainer
                    key={'HeroContainer'} />
            }


            {showBlueSkySearch &&
                <Suspense fallback={<DelayedFallback><BlueSkySkeleton context={'investigate'} /></DelayedFallback>}>
                    <BlueSkyPosts context={'investigate'} />
                </Suspense>
            }

            <Suspense
                key={'content-container'}
                fallback={<DelayedFallback delay={300}><ComponentLoader /></DelayedFallback>}
            >
                {(contentStatus === 'active') && <Content />}
            </Suspense>


            <PanelContainer key='control-panel-container' />

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


export default React.memo(InvestigationWorkSpace)