import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { productsData } from '../../../data/products';
import SectionHeader from '../../common/SectionHeader/SectionHeader';

const categories = ['All', 'Design', 'Development', 'Marketing'];

const Products = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [filtered, setFiltered] = useState(productsData);

    useEffect(() => {
        if (activeFilter === 'All') {
            setFiltered(productsData);
        } else {
            setFiltered(productsData.filter(p => p.category === activeFilter));
        }
    }, [activeFilter]);

    return (
        <section id="products" className="section-padding bg-[var(--bg-secondary)] overflow-hidden">
            <div className="container-custom">
                <SectionHeader 
                    label="Our Products"
                    title="Designed for the modern digital era"
                    subtitle="Explore our range of premium products built with the latest technologies and design principles."
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                                activeFilter === cat
                                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30'
                                    : 'bg-[var(--bg-tertiary)] hover:bg-brand-primary/10'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group bg-[var(--bg-primary)] rounded-[32px] overflow-hidden border border-[var(--border-color)] hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
                            >
                                {/* Image Container */}
                                <div className="h-64 overflow-hidden relative">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button className="bg-white text-black p-4 rounded-full flex items-center justify-center group-hover:rotate-0 rotate-45 transition-transform duration-500">
                                            <HiArrowUpRight size={24} />
                                        </button>
                                    </div>
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-widest border border-white/30">
                                        {product.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold group-hover:text-brand-primary transition-colors">{product.name}</h3>
                                        <p className="text-xl font-bold font-heading">${product.price}</p>
                                    </div>
                                    <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <a href="#" className="flex items-center justify-between group/link">
                                        <span className="font-bold border-b-2 border-transparent group-hover/link:border-brand-primary transition-all">View Project Details</span>
                                        <div className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center group-hover/link:bg-brand-primary group-hover/link:text-white group-hover/link:border-brand-primary transition-all">
                                            <HiArrowUpRight />
                                        </div>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View All Button */}
                <div className="mt-20 text-center">
                    <button className="border-2 border-[var(--border-color)] hover:border-brand-primary hover:text-brand-primary px-10 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95">
                        View All Products & Solutions
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Products;
