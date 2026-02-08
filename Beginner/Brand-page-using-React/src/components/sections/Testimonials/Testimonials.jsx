import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { testimonialsData } from '../../../data/testimonials';
import SectionHeader from '../../common/SectionHeader/SectionHeader';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const Testimonials = () => {
    return (
        <section id="testimonials" className="section-padding bg-[var(--bg-primary)] overflow-hidden">
            <div className="container-custom">
                <SectionHeader 
                    label="What People Say"
                    title="Don't just take our word for it"
                    subtitle="We've helped hundreds of businesses achieve their goals through our innovative digital solutions."
                />

                <div className="max-w-5xl mx-auto">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation, EffectFade]}
                        spaceBetween={50}
                        slidesPerView={1}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        effect="fade"
                        loop={true}
                        className="testimonial-swiper"
                    >
                        {testimonialsData.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="bg-[var(--bg-secondary)] p-10 md:p-16 rounded-[40px] border border-[var(--border-color)] relative overflow-hidden group">
                                    {/* Large Quote Icon */}
                                    <div className="absolute top-10 right-10 text-brand-primary opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                        <span className="text-[200px] leading-none select-none font-serif">❝</span>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        {/* Rating */}
                                        <div className="flex gap-1 mb-8">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <span key={i} className="text-accent-warning text-2xl">★</span>
                                            ))}
                                        </div>

                                        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 max-w-3xl">
                                            "{testimonial.quote}"
                                        </blockquote>

                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 p-1 border-2 border-brand-primary shadow-xl shadow-brand-primary/20">
                                                <img 
                                                    src={testimonial.avatar} 
                                                    alt={testimonial.name} 
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold">{testimonial.name}</h4>
                                                <p className="text-[var(--text-tertiary)] font-medium">
                                                    {testimonial.role} @ {testimonial.company}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .testimonial-swiper {
                    padding-bottom: 80px !important;
                }
                .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: var(--color-brand-primary) !important;
                    opacity: 0.2;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    width: 40px;
                    border-radius: 999px;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: var(--color-brand-primary) !important;
                    background: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .swiper-button-next::after, .swiper-button-prev::after {
                    font-size: 20px !important;
                    font-weight: bold;
                }
                @media (max-width: 768px) {
                    .swiper-button-next, .swiper-button-prev {
                        display: none !important;
                    }
                }
            `}} />
        </section>
    );
};

export default Testimonials;
