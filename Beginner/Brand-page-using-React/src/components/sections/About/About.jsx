import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';
import SectionHeader from '../../common/SectionHeader/SectionHeader';

const values = [
    { title: 'Innovation', desc: 'We push boundaries constantly to redefine what is possible in digital design.', icon: '🎯' },
    { title: 'Quality', desc: 'Excellence in every pixel. We never compromise on the standards of our deliverables.', icon: '💡' },
    { title: 'Collaboration', desc: 'Working together with our clients to create more impactful and meaningful solutions.', icon: '🤝' },
    { title: 'Sustainability', desc: 'Building for a better future by implementing ethical and sustainable design practices.', icon: '🌍' }
];

const About = () => {
    return (
        <section id="about" className="section-padding bg-[var(--bg-secondary)] overflow-hidden">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                    {/* Image Column */}
                    <div className="relative">
                        <AnimatedElement animation="fadeRight" duration={1}>
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white dark:border-[var(--bg-tertiary)] transform rotate-2">
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Our Team Working" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </AnimatedElement>

                        {/* Decorative Background Elements */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -z-0" />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-secondary/10 rounded-full blur-[80px] -z-0" />
                        
                        {/* Floating Stat Card */}
                        <AnimatedElement 
                            animation="scaleUp" 
                            delay={0.5} 
                            className="absolute -bottom-8 -left-8 z-20 bg-brand-primary text-white p-6 rounded-2xl shadow-xl shadow-brand-primary/30"
                        >
                            <p className="text-4xl font-bold mb-1">10+</p>
                            <p className="text-sm font-medium opacity-90 uppercase tracking-widest whitespace-nowrap">Years Experience</p>
                        </AnimatedElement>
                    </div>

                    {/* Text Column */}
                    <div className="space-y-8">
                        <SectionHeader 
                            label="Who We Are"
                            title="Empowering Brands Through Exceptional Digital Design"
                            align="left"
                        />
                        
                        <AnimatedElement animation="fadeUp" delay={0.3}>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                Founded in 2020, we set out to transform how brands connect with their audiences through design. We believe that every digital interaction is an opportunity to create a meaningful connection.
                            </p>
                            <p className="text-lg text-[var(--text-secondary)] mt-6 leading-relaxed">
                                Our multi-disciplinary team combines strategic thinking with creative excellence to deliver products that are not just beautiful, but also highly functional and business-driven.
                            </p>
                        </AnimatedElement>

                        <AnimatedElement animation="fadeUp" delay={0.4} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Strategy & Research',
                                'UI/UX Design',
                                'Product Development',
                                'Brand Identity'
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <HiCheckCircle className="text-brand-primary" size={24} />
                                    <span className="font-bold">{item}</span>
                                </div>
                            ))}
                        </AnimatedElement>

                        <AnimatedElement animation="fadeUp" delay={0.5}>
                            <a href="#" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all group pt-4">
                                Learn More About Our Story
                                <HiArrowRight />
                            </a>
                        </AnimatedElement>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <AnimatedElement 
                            key={value.title} 
                            animation="fadeUp" 
                            delay={index * 0.1}
                            className="p-8 rounded-2xl bg-[var(--bg-tertiary)] hover:bg-brand-primary group transition-all duration-500 cursor-default"
                        >
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{value.icon}</div>
                            <h4 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{value.title}</h4>
                            <p className="text-[var(--text-secondary)] group-hover:text-white/80 transition-colors leading-relaxed">
                                {value.desc}
                            </p>
                        </AnimatedElement>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
