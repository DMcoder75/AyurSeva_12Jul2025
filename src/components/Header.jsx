import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, Menu, X, User, LogOut, Leaf, Shield, Home, FileText, Pill, Users, Stethoscope, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import AnimatedNavLink from './AnimatedNavLink';
import AnimatedLogo from './AnimatedLogo';
import AnimatedButton from './AnimatedButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated, isAdmin, isDoctor } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row - Logo, Search, Profile, and Authentication */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <AnimatedLogo />

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex items-center w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for symptoms, conditions, remedies, herbs..."
                  className="pl-12 pr-4 py-2 w-full border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              <Button 
                type="submit" 
                className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Authentication and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Authentication-based navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated() ? (
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/profile" className="flex-1">
                    <AnimatedButton 
                      variant="primary"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                    >
                      {user?.avatar_url ? (
                        <motion.div 
                          className="w-6 h-6 rounded-full overflow-hidden mr-2"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img 
                            src={user.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <User className="h-4 w-4 mr-1" />
                      )}
                      <span className="hidden lg:inline">{user?.name || 'Profile'}</span>
                      <span className="lg:hidden">Profile</span>
                    </AnimatedButton>
                  </Link>
                  <AnimatedButton
                    onClick={handleSignOut}
                    variant="secondary"
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">Sign Out</span>
                    <span className="lg:hidden">Out</span>
                  </AnimatedButton>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to="/login">
                    <AnimatedButton 
                      variant="primary"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Sign In
                    </AnimatedButton>
                  </Link>
                </motion.div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Second Row - Navigation Menu (Desktop) */}
        <motion.div 
          className="hidden lg:block py-3 border-t border-green-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <nav className="flex items-center justify-center space-x-2">
            <AnimatedNavLink to="/" icon={Home} variant="glow">
              Home
            </AnimatedNavLink>
            <AnimatedNavLink to="/browse-issues" icon={FileText} variant="glow">
              Browse Issues
            </AnimatedNavLink>
            <AnimatedNavLink to="/remedies" icon={Pill} variant="glow">
              Browse Remedies
            </AnimatedNavLink>
            <AnimatedNavLink to="/browse-herbs" icon={Leaf} variant="glow">
              Browse Herbs
            </AnimatedNavLink>
            <AnimatedNavLink to="/doctors" icon={Stethoscope} variant="glow">
              Browse Doctors
            </AnimatedNavLink>
            <AnimatedNavLink to="/community" icon={MessageCircle} variant="glow" badge={isAuthenticated() ? "2" : null}>
              Community
            </AnimatedNavLink>
            
            {/* Consultation navigation based on user role */}
            {isAuthenticated() && isDoctor() && (
              <AnimatedNavLink to="/doctor-consultations" icon={Users} variant="glow">
                My Consultations
              </AnimatedNavLink>
            )}
            {isAuthenticated() && !isDoctor() && (
              <AnimatedNavLink to="/consultations" icon={Users} variant="glow">
                My Consultations
              </AnimatedNavLink>
            )}
            
            {/* Admin-only navigation */}
            {isAdmin() && (
              <AnimatedNavLink to="/admin" icon={Shield} variant="glow">
                Admin
              </AnimatedNavLink>
            )}
          </nav>
        </motion.div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-green-100">
            <div className="flex flex-col space-y-3">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search symptoms, remedies..."
                      className="pl-10 w-full border-green-200 focus:border-green-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-4"
                  >
                    Search
                  </Button>
                </form>
              </div>
              
              {/* Mobile Navigation Links */}
              <AnimatedNavLink to="/" icon={Home} variant="glow" className="mx-3">
                Home
              </AnimatedNavLink>
              <AnimatedNavLink to="/browse-issues" icon={FileText} variant="glow" className="mx-3">
                Browse Issues
              </AnimatedNavLink>
              <AnimatedNavLink to="/remedies" icon={Pill} variant="glow" className="mx-3">
                Browse Remedies
              </AnimatedNavLink>
              <AnimatedNavLink to="/browse-herbs" icon={Leaf} variant="glow" className="mx-3">
                Browse Herbs
              </AnimatedNavLink>
              <AnimatedNavLink to="/doctors" icon={Stethoscope} variant="glow" className="mx-3">
                Browse Doctors
              </AnimatedNavLink>
              <AnimatedNavLink to="/community" icon={MessageCircle} variant="glow" badge={isAuthenticated() ? "2" : null} className="mx-3">
                Community
              </AnimatedNavLink>
              
              {/* Consultation navigation based on user role */}
              {isAuthenticated() && isDoctor() && (
                <AnimatedNavLink to="/doctor-consultations" icon={Users} variant="glow" className="mx-3">
                  My Consultations
                </AnimatedNavLink>
              )}
              {isAuthenticated() && !isDoctor() && (
                <AnimatedNavLink to="/consultations" icon={Users} variant="glow" className="mx-3">
                  My Consultations
                </AnimatedNavLink>
              )}
              
              {/* Admin-only navigation */}
              {isAdmin() && (
                <AnimatedNavLink to="/admin" icon={Shield} variant="glow" className="mx-3">
                  Admin
                </AnimatedNavLink>
              )}
              
              {/* Mobile Authentication */}
              <div className="border-t border-green-100 pt-3 mt-3">
                {isAuthenticated() ? (
                  <div className="space-y-2">
                    <Link to="/profile" className="bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center px-3 py-2 rounded-md font-medium mx-3">
                      {user?.avatar_url ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                          <img 
                            src={user.avatar_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      {user?.name || 'Profile'} ({user?.role || 'general'})
                    </Link>
                    <div className="px-3">
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      to="/login" 
                      className="block px-3 py-2 bg-green-600 text-white hover:bg-green-700 font-medium rounded-md text-center mx-3"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

