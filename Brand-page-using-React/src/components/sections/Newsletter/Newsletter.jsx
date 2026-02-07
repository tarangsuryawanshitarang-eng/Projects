import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane } from 'react-icons/hi2';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setEmail('');

        // Reset status after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
    };

    return (
        <section className="py-24 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedElement animation="scaleUp">
                        <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <HiPaperAirplane size={36} className="rotate-45" />
                        </div>
                    </AnimatedElement>

                    <AnimatedElement animation="fadeUp" delay={0.1}>
                        <h2 className="text-4xl font-bold mb-6">Stay Ahead of the Curve</h2>
                        <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
                            Get exclusive early access to new features, expert design tips, and industry insights delivered straight to your inbox.
                        </p>
                    </AnimatedElement>

                    <AnimatedElement animation="fadeUp" delay={0.2}>
                        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-accent-success/10 text-accent-success p-4 rounded-2xl font-bold flex items-center justify-center gap-3"
                                    >
                                        <span>🎉</span> Thanks for subscribing! Check your email.
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col sm:flex-row gap-4 px-2"
                                    >
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="Enter your work email"
                                            className="grow bg-[var(--bg-primary)] border-2 border-[var(--border-color)] rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-primary transition-all text-lg"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-brand-primary/25 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Join Waitlist <HiPaperAirplane className="rotate-45" /></>
                                            )}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </AnimatedElement>

                    <AnimatedElement animation="fadeUp" delay={0.3}>
                        <p className="mt-8 text-[var(--text-tertiary)] text-sm">
                            Join over <span className="text-[var(--text-primary)] font-bold">5,000+</span> subscribers. No spam, ever.
                        </p>
                    </AnimatedElement>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
