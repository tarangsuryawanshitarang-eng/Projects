import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const animations = {
    fadeUp: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    },
    rotate: {
        hidden: { opacity: 0, rotate: -10 },
        visible: { opacity: 1, rotate: 0 },
    },
};

const AnimatedElement = ({
    children,
    animation = 'fadeUp',
    delay = 0,
    duration = 0.6,
    once = true,
    threshold = 0.2,
    className = '',
    as = 'div',
}) => {
    const { ref, inView } = useInView({
        triggerOnce: once,
        threshold,
    });

    const MotionComponent = motion[as] || motion.div;

    return (
        <MotionComponent
            ref={ref}
            className={className}
            variants={animations[animation]}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </MotionComponent>
    );
};

export default AnimatedElement;
