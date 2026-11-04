import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Phone, 
  Shield, 
  FileText, 
  LogIn, 
  User, 
  Users, 
  MessageSquare, 
  Leaf, 
  Heart, 
  Stethoscope, 
  Calendar, 
  Search, 
  Settings,
  Map,
  ExternalLink,
  Clock,
  Star
} from 'lucide-react';

const Sitemap = () => {
  const [animatedElements, setAnimatedElements] = useState([]);

  useEffect(() => {
    // Animate elements on load
    const timer = setTimeout(() => {
      setAnimatedElements(Array.from({ length: 18 }, (_, i) => i));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sitePages = [
    {
      category: "Main Pages",
      icon: Home,
      color: "from-blue-500 to-purple-600",
      pages: [
        { name: "Homepage", path: "/", icon: Home, priority: "1.0", frequency: "Daily", description: "Main landing page with featured content" },
        { name: "Community", path: "/community", icon: Users, priority: "0.9", frequency: "Daily", description: "Discussion forums and user interactions" },
      ]
    },
    {
      category: "Content Sections",
      icon: Leaf,
      color: "from-green-500 to-teal-600",
      pages: [
        { name: "Remedies", path: "/remedies", icon: Leaf, priority: "0.9", frequency: "Weekly", description: "Browse Ayurvedic remedies and treatments" },
        { name: "Health Issues", path: "/issues", icon: Heart, priority: "0.9", frequency: "Weekly", description: "Explore health conditions and symptoms" },
        { name: "Herbs", path: "/herbs", icon: Leaf, priority: "0.9", frequency: "Weekly", description: "Discover medicinal herbs and their properties" },
        { name: "Doctors", path: "/doctors", icon: Stethoscope, priority: "0.9", frequency: "Weekly", description: "Find qualified Ayurvedic practitioners" },
      ]
    },
    {
      category: "Information Pages",
      icon: Info,
      color: "from-orange-500 to-red-600",
      pages: [
        { name: "About Us", path: "/about", icon: Info, priority: "0.8", frequency: "Monthly", description: "Learn about our mission and team" },
        { name: "Contact Us", path: "/contact", icon: Phone, priority: "0.8", frequency: "Monthly", description: "Get in touch with our support team" },
        { name: "Privacy Policy", path: "/privacy", icon: Shield, priority: "0.8", frequency: "Monthly", description: "Our data protection and privacy policies" },
        { name: "Terms & Conditions", path: "/terms", icon: FileText, priority: "0.8", frequency: "Monthly", description: "Terms of service and usage guidelines" },
      ]
    },
    {
      category: "User Features",
      icon: User,
      color: "from-purple-500 to-pink-600",
      pages: [
        { name: "User Profile", path: "/profile", icon: User, priority: "0.7", frequency: "Weekly", description: "Manage your personal profile and preferences" },
        { name: "New Discussion", path: "/new-discussion", icon: MessageSquare, priority: "0.7", frequency: "Weekly", description: "Start a new community discussion" },
        { name: "Consultations", path: "/consultations", icon: Calendar, priority: "0.7", frequency: "Weekly", description: "View and manage your consultations" },
        { name: "Doctor Consultations", path: "/doctor-consultations", icon: Stethoscope, priority: "0.7", frequency: "Weekly", description: "Doctor's consultation management panel" },
        { name: "Book Consultation", path: "/book-consultation", icon: Calendar, priority: "0.7", frequency: "Weekly", description: "Schedule appointments with doctors" },
      ]
    },
    {
      category: "Utility Pages",
      icon: Settings,
      color: "from-gray-500 to-gray-700",
      pages: [
        { name: "Login", path: "/login", icon: LogIn, priority: "0.6", frequency: "Monthly", description: "User authentication and sign-in" },
        { name: "Search", path: "/search", icon: Search, priority: "0.6", frequency: "Weekly", description: "Search results and filtering" },
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    const p = parseFloat(priority);
    if (p >= 0.9) return "text-green-600 bg-green-100";
    if (p >= 0.8) return "text-blue-600 bg-blue-100";
    if (p >= 0.7) return "text-purple-600 bg-purple-100";
    return "text-gray-600 bg-gray-100";
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case "Daily": return "text-red-600 bg-red-100";
      case "Weekly": return "text-orange-600 bg-orange-100";
      case "Monthly": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Map className="w-16 h-16 text-white animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Website Sitemap
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in-delay">
            Navigate through all pages of the Ayur-seva wellness portal. Discover remedies, connect with doctors, and join our community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-semibold">18 Total Pages</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-semibold">5 Main Categories</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="font-semibold">SEO Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">High Priority Pages</h3>
                <p className="text-3xl font-bold text-green-600">7</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Daily Updates</h3>
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <ExternalLink className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">User Features</h3>
                <p className="text-3xl font-bold text-purple-600">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sitemap Categories */}
        <div className="space-y-12">
          {sitePages.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div 
                key={category.category}
                className={`transform transition-all duration-700 ${
                  animatedElements.includes(categoryIndex) 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${categoryIndex * 200}ms` }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6`}>
                    <div className="flex items-center text-white">
                      <CategoryIcon className="w-8 h-8 mr-4" />
                      <div>
                        <h2 className="text-2xl font-bold">{category.category}</h2>
                        <p className="text-white/80">{category.pages.length} pages in this section</p>
                      </div>
                    </div>
                  </div>

                  {/* Pages Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {category.pages.map((page, pageIndex) => {
                        const PageIcon = page.icon;
                        return (
                          <div 
                            key={page.path}
                            className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                <PageIcon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <Link 
                                    to={page.path}
                                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors group-hover:underline"
                                  >
                                    {page.name}
                                  </Link>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{page.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(page.priority)}`}>
                                    Priority: {page.priority}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(page.frequency)}`}>
                                    {page.frequency}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* XML Sitemap Link */}
        <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">XML Sitemap for Search Engines</h3>
          <p className="text-gray-300 mb-6">
            For search engine optimization, you can also access our machine-readable XML sitemap.
          </p>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            View XML Sitemap
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default Sitemap;

