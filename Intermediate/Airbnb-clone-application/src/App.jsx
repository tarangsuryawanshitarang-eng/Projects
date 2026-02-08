import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/ui/Footer';
import Toast from './components/ui/Toast';
import AuthModal from './components/modals/AuthModal';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms/:id" element={<ListingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        
        <Footer />
        
        {/* Global Components */}
        <AuthModal />
        <Toast />
      </div>
    </Router>
  );
}

export default App;
