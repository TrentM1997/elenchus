import { useLayoutEffect, useState, useRef, useCallback } from "react";

export type NotePosition = {
    x: number,
    y: number
};

type DragConstraints = {
    top: number,
    left: number,
    right: number,
    bottom: number
} | null;


type UseNoteConstraintsReturn = {
    notePosition: NotePosition;
    setNotePosition: React.Dispatch<React.SetStateAction<NotePosition>>;
    constraints: DragConstraints;
    notesRef: React.RefObject<HTMLDivElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
};

export const useNoteConstraints = (): UseNoteConstraintsReturn => {
    const notesRef = useRef(null);
    const containerRef = useRef(null);
    const [notePosition, setNotePosition] = useState<NotePosition>({ x: 20, y: 250 });
    const [constraints, setConstraints] = useState<DragConstraints>(null);

    const handleDragConstraints = useCallback(() => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();

        setConstraints({
            top: 0,
            left: 0,
            right: containerRect.width,
            bottom: containerRect.height
        });
    }, []);


    useLayoutEffect(() => {

        if (containerRef.current) {
            requestAnimationFrame(() => {
                handleDragConstraints();
            });
        };

        return () => {
            setNotePosition({ x: 20, y: 300 });
        };

    }, [handleDragConstraints]);

    return {
        notePosition: notePosition,
        setNotePosition: setNotePosition,
        constraints: constraints,
        notesRef: notesRef,
        containerRef: containerRef
    };
};