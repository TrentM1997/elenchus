import { useState } from 'react';

export function useScrollWithShadow() {
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);

    const onScrollHandler = (event) => {
        setScrollTop(event.target.scrollTop);
        setScrollHeight(event.target.scrollHeight);
        setClientHeight(event.target.clientHeight);
    };

    function getBoxShadow() {
        const isBottom = clientHeight === scrollHeight - scrollTop;
        const isTop = scrollTop === 0;
        const isBetween = scrollTop > 0 && clientHeight < scrollHeight - scrollTop;

        let boxShadow = 'none';
        const top = 'inset 0 10px 5px -6px rgba(255,255,255,0.08)';
        const bottom = 'inset 0 -10px 5px -5px rgba(255,255,255,0.08)';

        if (isTop) {
            boxShadow = bottom;
        } else if (isBetween) {
            boxShadow = `${top}, ${bottom}`;
        } else if (isBottom) {
            boxShadow = top;
        }
        return boxShadow;
    }

    return { boxShadow: getBoxShadow(), onScrollHandler }
};