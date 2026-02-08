import { featuresData } from '../../../data/features';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const Features = () => {
    return (
        <section id="features" className="section-padding bg-[var(--bg-primary)]">
            <div className="container-custom">
                <SectionHeader 
                    label="What We Offer"
                    title="Features that set us apart from the competition"
                    subtitle="Our comprehensive suite of tools and services is designed to help your brand thrive in a digital-first world."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <AnimatedElement 
                                key={feature.id} 
                                animation="fadeUp" 
                                delay={index * 0.1}
                                className="p-10 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Background Accent */}
                                <div 
                                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                                    style={{ backgroundColor: feature.color }}
                                />

                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                                    style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                                >
                                    <Icon size={32} />
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                    {feature.description}
                                </p>
                                
                                <a href="#" className="font-bold text-sm tracking-wider uppercase flex items-center gap-2 text-brand-primary/80 hover:text-brand-primary transition-colors">
                                    Learn More <span className="text-lg">→</span>
                                </a>
                            </AnimatedElement>
                        );
                    })}
                </div>
                
                {/* Advanced Feature Highlight */}
                <div className="mt-32 p-10 md:p-16 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                                Integrated Workflow for <br /> Modern Teams
                            </h3>
                            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                Our platform seamlessly integrates with your existing tools, ensuring a smooth transition and immediate productivity gains across your entire organization.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Real-time collaborative editing',
                                    'Advanced version control system',
                                    'Customizable dashboard & reporting'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-accent-success/20 flex items-center justify-center text-accent-success">
                                            <span className="text-xs font-bold font-heading">✓</span>
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative">
                            <AnimatedElement animation="fadeLeft">
                                <img 
                                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Workflow Illustration" 
                                    className="rounded-2xl shadow-2xl"
                                />
                            </AnimatedElement>
                            {/* Floating decorative elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
