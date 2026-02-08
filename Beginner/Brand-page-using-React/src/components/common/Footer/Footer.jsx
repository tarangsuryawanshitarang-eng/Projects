import { HiMail } from 'react-icons/hi';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <a href="#" className="flex items-center gap-2 group">
                            <span className="text-brand-primary text-2xl group-hover:rotate-12 transition-transform duration-300">◆</span>
                            <span className="text-xl font-bold tracking-tight">BrandName</span>
                        </a>
                        <p className="text-[var(--text-secondary)] leading-relaxed max-w-xs">
                            Building the future of digital experiences through innovative design and cutting-edge technology.
                        </p>
                        <div className="flex gap-4">
                            {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, i) => (
                                <a key={i} href="#" className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-brand-primary hover:text-white transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Press', 'Contact', 'Blog'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-[var(--text-secondary)] hover:text-brand-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {['Documentation', 'Help Center', 'Community', 'Changelog', 'Security'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-[var(--text-secondary)] hover:text-brand-primary transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h4 className="font-bold mb-6">Stay in the Loop</h4>
                        <p className="text-[var(--text-secondary)]">Subscribe to our newsletter for the latest updates and exclusive offers.</p>
                        <form className="relative">
                            <input 
                                type="email" 
                                placeholder="Your email" 
                                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                            />
                            <button className="absolute right-2 top-2 p-1.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors">
                                <HiMail size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--text-tertiary)] text-sm">
                        © {currentYear} BrandName. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-[var(--text-tertiary)]">
                        <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
