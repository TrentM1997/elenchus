import { useEffect, useState } from "react";
import React from "react";

interface DelayFallback {
    delay?: number,
    children: React.ReactNode | React.ReactNode[]
};

function DelayedFallback({ delay = 150, children }: DelayFallback): JSX.Element | null {
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


export default React.memo(DelayedFallback);