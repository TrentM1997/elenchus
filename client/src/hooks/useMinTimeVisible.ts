import { useEffect, useState, useRef } from "react";


export function useMinTimeVisible(showTarget: boolean, delayIn: number = 150, minVisible: number = 600) {
    const [visible, setVisible] = useState<boolean>();
    const shownAt = useRef<number | null>(null);


    useEffect(() => {
        if (showTarget) {
            const timer = window.setTimeout(() => {
                shownAt.current = performance.now();
                setVisible(true);
            }, delayIn);

            return () => {
                clearTimeout(timer);
            }

        } else {
            if (!visible) return;
            const elapsedTime: number = shownAt.current ? performance.now() - shownAt.current : minVisible;
            const wait: number = Math.max(0, (minVisible - elapsedTime));
            const mountedTimer = window.setTimeout(() => {
                setVisible(false);
            }, wait);

            return () => {
                clearTimeout(mountedTimer);
            };
        };

    }, [showTarget, delayIn, visible, minVisible]);

    return visible;
};