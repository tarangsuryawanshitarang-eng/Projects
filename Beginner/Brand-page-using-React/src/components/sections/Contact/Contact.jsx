import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import AnimatedElement from '../../common/AnimatedElement/AnimatedElement';

const Contact = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Form data:', data);
        reset();
    };

    const contactInfo = [
        { icon: HiLocationMarker, title: 'Office Address', detail: '123 Brand Street, Suite 500, San Francisco, CA 94103' },
        { icon: HiMail, title: 'Email Address', detail: 'hello@brandname.com' },
        { icon: HiPhone, title: 'Phone Number', detail: '+1 (555) 123-4567' },
        { icon: HiClock, title: 'Working Hours', detail: 'Mon - Fri: 9:00 AM - 6:00 PM' }
    ];

    return (
        <section id="contact" className="section-padding bg-[var(--bg-secondary)]">
            <div className="container-custom">
                <SectionHeader 
                    label="Get In Touch"
                    title="Let's build something amazing together"
                    subtitle="Have a project in mind or just want to say hi? We'd love to hear from you. Drop us a message!"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Information Column */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                            {contactInfo.map((info, index) => (
                                <AnimatedElement 
                                    key={info.title} 
                                    animation="fadeUp" 
                                    delay={index * 0.1}
                                    className="flex items-start gap-6 p-6 rounded-3xl bg-[var(--bg-tertiary)] hover:bg-brand-primary/5 transition-colors border border-transparent hover:border-brand-primary/20"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                        <info.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1">{info.title}</h4>
                                        <p className="text-[var(--text-secondary)] leading-relaxed">{info.detail}</p>
                                    </div>
                                </AnimatedElement>
                            ))}
                        </div>

                        {/* Interactive Map Placeholder */}
                        <AnimatedElement animation="fadeUp" delay={0.4} className="h-64 rounded-3xl overflow-hidden grayscale contrast-125 border border-[var(--border-color)]">
                            <iframe 
                                title="Office Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.83543450937!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050c62!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1683456789012!5m2!1sen!2sus" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                            />
                        </AnimatedElement>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        <AnimatedElement animation="fadeLeft" className="bg-[var(--bg-primary)] p-8 md:p-12 rounded-[40px] border border-[var(--border-color)] shadow-xl shadow-black/5">
                            {isSubmitSuccessful ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 space-y-6"
                                >
                                    <div className="w-24 h-24 bg-accent-success/10 text-accent-success rounded-full flex items-center justify-center mx-auto mb-8">
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            className="text-5xl"
                                        >
                                            ✓
                                        </motion.span>
                                    </div>
                                    <h3 className="text-3xl font-bold">Message Sent!</h3>
                                    <p className="text-lg text-[var(--text-secondary)] max-w-sm mx-auto">
                                        Thank you for reaching out. Our team will get back to you within 24 hours.
                                    </p>
                                    <button 
                                        onClick={() => reset()}
                                        className="text-brand-primary font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <input 
                                                {...register('name', { required: 'Name is required' })}
                                                placeholder="Your Name"
                                                className={`w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all transition-all ${errors.name ? 'border-accent-error ring-accent-error/20' : ''}`}
                                            />
                                            {errors.name && <span className="text-accent-error text-xs font-bold pl-2">{errors.name.message}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <input 
                                                {...register('email', { 
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                placeholder="Your Email"
                                                className={`w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all transition-all ${errors.email ? 'border-accent-error ring-accent-error/20' : ''}`}
                                            />
                                            {errors.email && <span className="text-accent-error text-xs font-bold pl-2">{errors.email.message}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <select 
                                            {...register('subject')}
                                            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all transition-all"
                                        >
                                            <option value="">Select Subject</option>
                                            <option value="Inquiry">General Inquiry</option>
                                            <option value="Project">New Project</option>
                                            <option value="Collaboration">Collaboration</option>
                                            <option value="Support">Support</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <textarea 
                                            {...register('message', { 
                                                required: 'Message is required',
                                                minLength: { value: 10, message: 'Message too short' }
                                            })}
                                            placeholder="Tell us about your project..."
                                            rows={6}
                                            className={`w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all transition-all resize-none ${errors.message ? 'border-accent-error ring-accent-error/20' : ''}`}
                                        />
                                        {errors.message && <span className="text-accent-error text-xs font-bold pl-2">{errors.message.message}</span>}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-brand-primary/25 lg:hover:shadow-brand-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-4"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending Message...
                                            </>
                                        ) : (
                                            'Shoot Your Message →'
                                        )}
                                    </button>
                                </form>
                            )}
                        </AnimatedElement>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
