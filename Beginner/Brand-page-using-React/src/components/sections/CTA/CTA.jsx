import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const CTA = () => {
    return (
        <section className="py-24 md:py-32 bg-[var(--bg-primary)] overflow-hidden">
            <div className="container-custom">
                <div className="relative rounded-[60px] bg-brand-primary overflow-hidden px-8 py-20 md:py-32 text-center text-white shadow-2xl shadow-brand-primary/40">
                    {/* Background Decorative Orbs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <motion.div 
                            className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]"
                            animate={{ 
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, 30, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-brand-secondary/20 rounded-full blur-[100px]"
                            animate={{ 
                                scale: [1.2, 1, 1.2],
                                x: [0, -50, 0],
                                y: [0, -30, 0]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                        <AnimatedElement animation="fadeUp">
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                                Ready to Transform Your <br /> Digital Presence?
                            </h2>
                        </AnimatedElement>

                        <AnimatedElement animation="fadeUp" delay={0.1}>
                            <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                                Join 10,000+ companies already using our platform to build stunning digital experiences that captivate and convert.
                            </p>
                        </AnimatedElement>

                        <AnimatedElement animation="fadeUp" delay={0.2} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <a 
                                href="#contact" 
                                className="bg-white text-brand-primary hover:bg-[var(--neutral-100)] px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                            >
                                Start Your Free Trial
                                <HiArrowRight />
                            </a>
                            <button className="bg-brand-primary-dark/30 backdrop-blur-md border border-white/20 hover:bg-white/10 px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center">
                                Schedule a Demo
                            </button>
                        </AnimatedElement>

                        <AnimatedElement animation="fadeUp" delay={0.3}>
                            <p className="text-sm font-medium text-white/60 tracking-wide uppercase">
                                No credit card required • 14-day free trial • Cancel anytime
                            </p>
                        </AnimatedElement>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
