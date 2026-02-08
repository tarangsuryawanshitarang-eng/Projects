import { Link } from 'react-router-dom';
import { MdLanguage } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-gray border-t border-border">
      <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section - Copyright and Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-text-primary">
            <span>© {currentYear} Airbnb, Inc.</span>
            <span className="hidden md:inline">·</span>
            <Link to="#" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link to="#" className="hover:underline">Sitemap</Link>
            <span>·</span>
            <Link to="#" className="hover:underline">Privacy</Link>
          </div>

          {/* Right Section - Language and Currency */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="flex items-center gap-2 hover:underline">
              <MdLanguage className="w-5 h-5" />
              <span>English (US)</span>
            </button>
            <button className="hover:underline">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
