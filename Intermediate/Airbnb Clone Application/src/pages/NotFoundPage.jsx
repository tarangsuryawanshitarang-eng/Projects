import { Link } from 'react-router-dom';
import { MdHome } from 'react-icons/md';

const NotFoundPage = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Oops! Page not found</h2>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back home.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-airbnb hover:bg-airbnb-dark text-white rounded-lg font-medium transition-colors"
        >
          <MdHome className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
