import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, HashRouter, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Sitemap from './components/Sitemap';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import IssueDetail from './components/IssueDetail';
import RemedyDetail from './components/RemedyDetail';
import HerbDetail from './components/HerbDetail';
import Community from './components/Community';
import DiscussionDetail from './components/DiscussionDetail';
import NewDiscussion from './components/NewDiscussion';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import BrowseIssues from './components/BrowseIssues';
import BrowseHerbs from './components/BrowseHerbs';
import BrowseDoctors from './components/BrowseDoctors';
import DoctorDetail from './components/DoctorDetail';
import CategoryPage from './components/CategoryPage';
import RemediesList from './components/RemediesList';
import SearchResults from './components/SearchResults';
import AdminDashboard from './components/AdminDashboard';
import DoctorConsultations from './components/DoctorConsultations';
import PatientConsultations, { ConsultationBooking } from './components/PatientConsultations';
import './App.css';

// Error boundary component for handling routing errors
const ErrorBoundary = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  
  useEffect(() => {
    // If we're on a route that doesn't exist and it's not the home page,
    // redirect to home page
    const validRoutes = [
      '/',
      '/about',
      '/contact',
      '/sitemap',
      '/privacy',
      '/terms',
      '/login',
      '/profile',
      '/profile/edit',
      '/profile/settings',
      '/community',
      '/new-discussion',
      '/remedies',
      '/issues',
      '/herbs',
      '/doctors',
      '/browse-issues',
      '/browse-remedies',
      '/browse-herbs',
      '/browse-doctors',
      '/category',
      '/admin',
      '/consultations',
      '/doctor-consultations',
      '/book-consultation',
      '/search'
    ];
    
    const isValidRoute = validRoutes.some(route => 
      location.pathname === route || 
      location.pathname.startsWith(route + '/') ||
      location.pathname.startsWith('/community/') ||
      location.pathname.startsWith('/discussion/') ||
      location.pathname.startsWith('/remedies/')
    );
    
    // Don't redirect if it's a valid route or a community/discussion route
    if (!isValidRoute && location.pathname !== '/' && 
        !location.pathname.startsWith('/community/') && 
        !location.pathname.startsWith('/discussion/')) {
      console.log('Invalid route detected, redirecting to home');
      navigate('/'); // Use navigate instead of window.location.href
    }
  }, [location, navigate]); // Add navigate to dependency array
  
  return children;
};

// Main App Content component that uses AuthProvider inside Router
const AppContent = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/discussion/:id" element={<DiscussionDetail />} />
            <Route path="/discussion/:id" element={<DiscussionDetail />} />
            <Route path="/new-discussion" element={<NewDiscussion />} />
            <Route path="/remedies" element={<RemediesList />} />
            <Route path="/remedies/:slug" element={<RemedyDetail />} />
            <Route path="/issues" element={<BrowseIssues />} />
            <Route path="/browse-issues" element={<BrowseIssues />} />
            <Route path="/issues/:slug" element={<IssueDetail />} />
            <Route path="/herbs" element={<BrowseHerbs />} />
            <Route path="/browse-herbs" element={<BrowseHerbs />} />
            <Route path="/herbs/:slug" element={<HerbDetail />} />
            <Route path="/doctors" element={<BrowseDoctors />} />
            <Route path="/browse-doctors" element={<BrowseDoctors />} />
            <Route path="/doctors/:slug" element={<DoctorDetail />} />
            <Route path="/consultations" element={<PatientConsultations />} />
            <Route path="/doctor-consultations" element={<DoctorConsultations />} />
            <Route path="/book-consultation/:doctorSlug" element={<ConsultationBooking />} />
            <Route path="/browse-remedies" element={<RemediesList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Catch-all route that redirects to home */}
            <Route path="*" element={<Homepage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;


