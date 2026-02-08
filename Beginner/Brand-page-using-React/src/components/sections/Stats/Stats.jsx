import { statsData } from '../../../data/stats';
import { useCountUp } from '../../../hooks/useCountUp';

const StatItem = ({ stat }) => {
    const { count, ref } = useCountUp(stat.value);

    return (
        <div ref={ref} className="text-center group p-8 lg:p-12 hover:scale-110 transition-transform duration-500">
            <div className="text-5xl mb-6 group-hover:rotate-12 transition-transform">{stat.icon}</div>
            <div className="text-5xl lg:text-7xl font-bold font-heading mb-4 gradient-text">
                {count}{stat.suffix}
            </div>
            <p className="text-sm lg:text-lg font-bold uppercase tracking-widest text-white/70">
                {stat.label}
            </p>
        </div>
    );
};

const Stats = () => {
    return (
        <section id="stats" className="py-24 lg:py-40 bg-[var(--bg-secondary)] relative overflow-hidden">
            {/* Dark Background Overlay */}
            <div className="absolute inset-0 bg-neutral-900 z-0" />
            
            {/* Animated Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(var(--color-brand-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary rounded-full blur-[150px] opacity-20" />
            </div>

            <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-x-0 lg:divide-x divide-white/10">
                    {statsData.map((stat) => (
                        <StatItem key={stat.id} stat={stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
