import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { useTheme } from '../../../context/ThemeContext';
import { navLinks } from '../../../data/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const scrollY = useScrollPosition();
    const { theme, toggleTheme } = useTheme();

    const isScrolled = scrollY > 50;

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            const navHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
        );

        navLinks.forEach(({ href }) => {
            const el = document.querySelector(href);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                ? 'bg-[var(--nav-bg)] backdrop-blur-md shadow-lg py-3' 
                : 'bg-transparent py-5'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <span className="text-brand-primary text-2xl group-hover:rotate-12 transition-transform duration-300">◆</span>
                    <span className="text-xl font-bold tracking-tight">BrandName</span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                                activeSection === link.href.slice(1)
                                    ? 'text-brand-primary underline underline-offset-8 decoration-2'
                                    : 'text-[var(--text-secondary)]'
                            }`}
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Right side: Theme toggle + CTA */}
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    <a 
                        href="#contact" 
                        className="hidden sm:block bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-brand-primary/20"
                        onClick={(e) => handleNavClick(e, '#contact')}
                    >
                        Get Started →
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-[var(--text-primary)]"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 top-[72px] bg-[var(--bg-primary)] z-40 md:hidden flex flex-col p-8 gap-6"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {navLinks.map((link, index) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                className="text-2xl font-bold hover:text-brand-primary transition-colors"
                                onClick={(e) => handleNavClick(e, link.href)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.a
                            href="#contact"
                            className="mt-4 bg-brand-primary text-white text-center py-4 rounded-xl font-bold text-lg"
                            onClick={(e) => handleNavClick(e, '#contact')}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: navLinks.length * 0.1 }}
                        >
                            Get Started →
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
