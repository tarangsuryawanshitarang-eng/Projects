import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (inView && !hasAnimated.current) {
            hasAnimated.current = true;
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [inView, end, duration]);

    return { count, ref };
};
