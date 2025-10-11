import { useEffect, useState } from "react";

interface DelayFallback {
    delay?: number,
    children: React.ReactNode
};

export default function DelayedFallback({ delay = 150, children }: DelayFallback): JSX.Element | null {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {

        const timer = window.setTimeout(() => {
            setShow(true);
        }, delay);

        return () => {
            clearTimeout(timer);
        }
    }, [delay]);


    return show ? (<>{children}</>) : null;
};