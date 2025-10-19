import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrolltoTop() {
    const { pathname } = useLocation()

    useEffect(() => {

        const scrollBehavior: ScrollToOptions = {
            top: 0,
            left: 0,
            behavior: 'smooth' as any
        }

        window.scroll(scrollBehavior);
    }, [pathname]);

    return null
}

export default ScrolltoTop


export const ScrollUp = (): void => {

    const scrollBehavior: ScrollToOptions = {
        top: 0,
        left: 0,
        behavior: 'instant' as any
    }

    window.scroll(scrollBehavior)
};