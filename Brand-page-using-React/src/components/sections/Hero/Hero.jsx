import { motion } from 'framer-motion';
import { HiArrowRight, HiPlay } from 'react-icons/hi';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--bg-primary)]">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-full xl:w-1/2 h-full opacity-10 dark:opacity-20 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-brand-secondary rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div 
                        className="space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                            </span>
                            ✨ NOW IN V2.0 — NEW FEATURES RELEASED
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                            Crafting Digital <br />
                            <span className="gradient-text">Experiences</span> That <br />
                            Inspire <span className="text-brand-primary">✦</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-lg">
                            We design and build premium digital products that push boundaries, delight users, and drive meaningful growth for forward-thinking brands.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="#contact" className="group flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-primary/20">
                                Get Started
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all">
                                <span className="p-1 bg-brand-primary/10 rounded-full text-brand-primary">
                                    <HiPlay size={20} />
                                </span>
                                Watch Demo
                            </button>
                        </motion.div>

                        {/* Trusted By Section */}
                        <motion.div variants={itemVariants} className="pt-12">
                            <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-8">Trusted by industry leaders</p>
                            <div className="relative overflow-hidden w-full max-w-lg">
                                <div className="flex gap-12 animate-scroll whitespace-nowrap">
                                    {['Google', 'Meta', 'Apple', 'Spotify', 'Figma', 'Stripe', 'Google', 'Meta', 'Apple', 'Spotify', 'Figma', 'Stripe'].map((brand, i) => (
                                        <span key={`${brand}-${i}`} className="text-xl font-bold font-heading text-[var(--text-tertiary)] hover:text-brand-primary transition-colors cursor-default select-none">
                                            {brand}
                                        </span>
                                    ))}
                                </div>
                                {/* Gradient Fades */}
                                <div className="absolute inset-y-0 left-0 w-12 bg-linear-to-r from-[var(--bg-primary)] to-transparent z-10" />
                                <div className="absolute inset-y-0 right-0 w-12 bg-linear-to-l from-[var(--bg-primary)] to-transparent z-10" />
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* Right Visual */}
                    <AnimatedElement animation="fadeLeft" delay={0.8} duration={1}>
                        <div className="relative">
                            {/* Main Hero Image */}
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-square lg:aspect-video flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 backdrop-blur-3xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Hero Visual" 
                                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-brand-primary/30 rounded-full flex items-center justify-center animate-pulse">
                                        <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-lg">
                                            <HiPlay className="text-white ml-1" size={32} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div 
                                className="absolute -top-10 -right-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hidden xl:block"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent-success/20 flex items-center justify-center text-accent-success">
                                        <HiPlay size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Performance Boost</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">Analytics up by 124%</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="absolute -bottom-10 -left-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl hidden xl:block"
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold">10k+ Happy Clients</p>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatedElement>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-[var(--border-color)] rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-3 bg-brand-primary rounded-full" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
