import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { teamData } from '../../../data/team';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const Team = () => {
    return (
        <section id="team" className="section-padding bg-[var(--bg-secondary)]">
            <div className="container-custom">
                <SectionHeader 
                    label="The A-Team"
                    title="Meet the minds behind the magic"
                    subtitle="A diverse group of visionaries, pixel pushers, and code poets working together to build the future."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {teamData.map((member, index) => (
                        <AnimatedElement 
                            key={member.id} 
                            animation="fadeUp" 
                            delay={index * 0.1}
                            className="group"
                        >
                            <div className="relative mb-8 rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl transition-all duration-700 group-hover:shadow-brand-primary/20 group-hover:-translate-y-2">
                                <img 
                                    src={member.avatar} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Overlay with Socials */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <div className="flex gap-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                        <a href={member.socials.twitter} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                            <FaTwitter size={18} />
                                        </a>
                                        <a href={member.socials.linkedin} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                            <FaLinkedin size={18} />
                                        </a>
                                        <a href={member.socials.github} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all">
                                            <FaGithub size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-bold group-hover:text-brand-primary transition-colors mb-1">{member.name}</h4>
                                <p className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4">{member.role}</p>
                                <p className="text-[var(--text-secondary)] leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </AnimatedElement>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
