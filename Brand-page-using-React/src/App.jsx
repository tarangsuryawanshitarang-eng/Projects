import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

// Common components
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';
import Loader from './components/common/Loader/Loader';

// Sections
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import Features from './components/sections/Features/Features';
import Products from './components/sections/Products/Products';
import Stats from './components/sections/Stats/Stats';
import Testimonials from './components/sections/Testimonials/Testimonials';
import Team from './components/sections/Team/Team';
import CTA from './components/sections/CTA/CTA';
import Newsletter from './components/sections/Newsletter/Newsletter';
import Contact from './components/sections/Contact/Contact';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeProvider>
            <div className="min-h-screen">
                <Helmet>
                    <title>BrandName — Crafting Digital Experiences That Inspire</title>
                    <meta name="description" content="We design and build premium digital products that push boundaries and delight users." />
                    <meta name="keywords" content="design, brand, digital, products, tech startup, saas" />
                    
                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://brandname-demo.vercel.app/" />
                    <meta property="og:title" content="BrandName — Crafting Digital Experiences" />
                    <meta property="og:description" content="We design and build premium digital products that push boundaries and delight users." />
                    <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" />

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:title" content="BrandName — Crafting Digital Experiences" />
                    <meta property="twitter:description" content="We design and build premium digital products that push boundaries and delight users." />
                </Helmet>

                <AnimatePresence mode="wait">
                    {isLoading && <Loader key="loader" />}
                </AnimatePresence>

                {!isLoading && (
                    <div className="fade-in">
                        <Navbar />
                        <main>
                            <Hero />
                            <About />
                            <Features />
                            <Products />
                            <Stats />
                            <Testimonials />
                            <Team />
                            <CTA />
                            <Newsletter />
                            <Contact />
                        </main>
                        <Footer />
                        <ScrollToTop />
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
