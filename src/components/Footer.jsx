import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Leaf, 
  Stethoscope, 
  Heart, 
  Users, 
  Info, 
  Phone, 
  Map, 
  Shield, 
  FileText, 
  HelpCircle,
  Eye,
  TrendingUp,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your newsletter service
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();
  const siteVisits = "2,847,392";
  const siteRank = "#1,247";

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          
          {/* Brand & About Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="mb-6">
              <Link to="/" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
                Ayur-Seva
              </Link>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                Discover ancient wisdom for modern wellness. Your trusted platform for Ayurvedic remedies and holistic health solutions.
              </p>
            </div>
            
            {/* Site Stats */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Eye className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">Site Visits: </span>
                <span className="text-white font-semibold ml-1">{siteVisits}</span>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-300">Site Rank: </span>
                <span className="text-white font-semibold ml-1">{siteRank}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1 xl:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-600 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Home className="w-4 h-4 mr-2" />Home
                </Link>
              </li>
              <li>
                <Link to="/remedies" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Leaf className="w-4 h-4 mr-2" />Browse Remedies
                </Link>
              </li>
              <li>
                <Link to="/herbs" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Leaf className="w-4 h-4 mr-2" />Herbal Encyclopedia
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" />Consult Doctors
                </Link>
              </li>
              <li>
                <Link to="/issues" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2" />Health Issues
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2" />Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Health Categories */}
          <div className="lg:col-span-1 xl:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-600 pb-2">
              Health Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/categories/digestive" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-green-400" />Digestive Health
                </Link>
              </li>
              <li>
                <Link to="/categories/respiratory" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-blue-400" />Respiratory Care
                </Link>
              </li>
              <li>
                <Link to="/categories/skin" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-yellow-400" />Skin Care
                </Link>
              </li>
              <li>
                <Link to="/categories/mental-health" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-purple-400" />Mental Wellness
                </Link>
              </li>
              <li>
                <Link to="/categories/pain-relief" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-400" />Pain Relief
                </Link>
              </li>
              <li>
                <Link to="/categories/womens-health" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-pink-400" />Women's Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="lg:col-span-1 xl:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-600 pb-2">
              Support & Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Info className="w-4 h-4 mr-2" />About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Phone className="w-4 h-4 mr-2" />Contact Us
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Map className="w-4 h-4 mr-2" />Sitemap
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-2" />Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-2" />Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="lg:col-span-2 xl:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-green-600 pb-2">
              Stay Connected
            </h3>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">
                Subscribe to our newsletter for wellness tips and updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Subscribe
                  </button>
                </div>
                {subscribed && (
                  <p className="text-green-400 text-xs">✅ Successfully subscribed!</p>
                )}
              </form>
            </div>

            {/* Social Media Links */}
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Discord"
                >
                  <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2025 <span className="text-green-400 font-medium">Dalsi Music Studio</span>. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-4 text-xs text-gray-500">
              <span>Made with ❤️ for wellness</span>
              <span>•</span>
              <span>Powered by Ayurveda</span>
              <span>•</span>
              <Link to="/accessibility" className="hover:text-green-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

