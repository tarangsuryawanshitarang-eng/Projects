import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <motion.div
            className="fixed inset-0 bg-[var(--bg-primary)] z-[100] flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.8, ease: 'easeInOut' },
            }}
        >
            <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                }}
            >
                <motion.span 
                    className="text-brand-primary text-5xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    ◆
                </motion.span>
                <span className="text-3xl font-bold tracking-tighter">BrandName</span>
            </motion.div>

            <div className="w-64 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden relative">
                <motion.div
                    className="absolute inset-0 bg-brand-primary"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: 'easeInOut' 
                    }}
                />
            </div>
            
            <motion.p 
                className="mt-6 text-[var(--text-tertiary)] font-medium tracking-widest uppercase text-xs"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Initializing Experience
            </motion.p>
        </motion.div>
    );
};

export default Loader;
