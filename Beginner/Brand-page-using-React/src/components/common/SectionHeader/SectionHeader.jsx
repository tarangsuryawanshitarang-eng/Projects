import AnimatedElement from '../AnimatedElement/AnimatedElement';

const SectionHeader = ({ label, title, subtitle, align = 'center' }) => {
    return (
        <div className={`mb-16 md:mb-24 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'}`}>
            <AnimatedElement animation="fadeUp">
                <span className="text-brand-primary font-bold uppercase tracking-widest text-sm mb-4 block">
                    — {label} —
                </span>
            </AnimatedElement>
            
            <AnimatedElement animation="fadeUp" delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {title}
                </h2>
            </AnimatedElement>
            
            {subtitle && (
                <AnimatedElement animation="fadeUp" delay={0.2}>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                        {subtitle}
                    </p>
                </AnimatedElement>
            )}
        </div>
    );
};

export default SectionHeader;
