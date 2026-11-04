import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase'; // Import supabase
import CommunityPanel from './CommunityPanel';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';
import AnimatedSection from './AnimatedSection';
import StaggeredContainer from './StaggeredContainer';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredRemedies, setFeaturedRemedies] = useState([]);
  const [recommendedRemedies, setRecommendedRemedies] = useState({
    respiratory: [],
    digestive: [],
    "stress-anxiety": [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to comprehensive search page
      navigate(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Function to create URL-friendly slug from remedy name
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  // Function to get remedy image based on name (assuming image paths are stored in DB or follow a pattern)
  const getRemedyImage = (remedyName, index) => {
    // For now, we'll use a placeholder or a simple mapping if images are not in DB
    // In a real scenario, you'd fetch image paths from the DB or have a consistent naming convention
    const imageMap = {
      'Eucalyptus Treatment': 'SectionImgEucalyptus_Treatment.png',
      'Eucalyptus Treatment (Steam Inhalation)': 'SectionImgEucalyptus_Treatment.png',
      'Turmeric Gargle': 'SectionImgTurmeric_Gargle.png',
      'Ginger Baking Soda Bath': 'SectionImgGinger_Baking_Soda_Bath.png',
      'Cumin, Coriander, Fennel Tea (CCF Tea)': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'Cumin Coriander Fennel Tea CCF Tea': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
    };

    const cleanName = remedyName.split(' Description')[0];
    if (imageMap[cleanName]) {
      return imageMap[cleanName];
    }
    
    // Fallback to a generic image if no specific image is found
    return 'FeatureRemedyAvtar.png';
  };

  useEffect(() => {
    fetchFeaturedRemedies();
    fetchRecommendedRemedies();
  }, []);

  const fetchFeaturedRemedies = async () => {
    try {
      const { data, error } = await supabase
        .from('remedies')
        .select('id, name, description, category, slug, difficulty')
        .limit(3); // Fetch 3 featured remedies

      if (error) {
        console.error('Error fetching featured remedies:', error);
        setLoading(false);
        return;
      }
      
      setFeaturedRemedies(data);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error fetching featured remedies:', error);
      setLoading(false);
    }
  };

  const fetchRecommendedRemedies = async () => {
    try {
      const { data, error } = await supabase
        .from("remedies")
        .select("id, name, description, category, slug");

      if (error) {
        console.error("Error fetching all remedies:", error);
        return;
      }

      const respiratoryData = data.filter(remedy => remedy.category && (remedy.category.includes("Respiratory") || remedy.category.includes("Cold & Cough Remedy") || remedy.category.includes("Throat Remedy"))).slice(0, 3);
      const digestiveData = data.filter(remedy => remedy.category && (remedy.category.includes("Digestive") || remedy.category.includes("Digestive Aid") || remedy.category.includes("Nourishing Food"))).slice(0, 3);
      const stressAnxietyData = data.filter(remedy => remedy.category && (remedy.category.includes("Nervous System") || remedy.category.includes("Sleep Aid") || remedy.category.includes("Stress Reduction") || remedy.category.includes("Mental Clarity") || remedy.category.includes("Herbal Tea") || remedy.category.includes("Body Care & Wellness Practice"))).slice(0, 3);

      setRecommendedRemedies({
        respiratory: respiratoryData || [],
        digestive: digestiveData || [],
        "stress-anxiety": stressAnxietyData || [],
      });
    } catch (error) {
      console.error("Unexpected error fetching recommended remedies:", error);
    }
  };

  const categories = [
    { 
      id: 'digestive', 
      name: 'Digestive', 
      icon: '💚', 
      color: 'bg-green-100 text-green-700',
      gradient: 'from-green-400 to-emerald-500',
      hoverGradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      description: '24 remedies'
    },
    { 
      id: 'respiratory', 
      name: 'Respiratory', 
      icon: '💨', 
      color: 'bg-blue-100 text-blue-700',
      gradient: 'from-blue-400 to-cyan-500',
      hoverGradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      description: '18 remedies'
    },
    { 
      id: 'skin', 
      name: 'Skin', 
      icon: '✨', 
      color: 'bg-yellow-100 text-yellow-700',
      gradient: 'from-yellow-400 to-orange-500',
      hoverGradient: 'from-yellow-500 to-orange-600',
      iconBg: 'bg-yellow-100',
      description: '15 remedies'
    },
    { 
      id: 'mental-health', 
      name: 'Mental Health', 
      icon: '🧠', 
      color: 'bg-purple-100 text-purple-700',
      gradient: 'from-purple-400 to-indigo-500',
      hoverGradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100',
      description: '12 remedies'
    },
    { 
      id: 'pain-relief', 
      name: 'Pain Relief', 
      icon: '⚡', 
      color: 'bg-orange-100 text-orange-700',
      gradient: 'from-orange-400 to-red-500',
      hoverGradient: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100',
      description: '20 remedies'
    },
    { 
      id: 'womens-health', 
      name: 'Women\'s Health', 
      icon: '🌸', 
      color: 'bg-pink-100 text-pink-700',
      gradient: 'from-pink-400 to-rose-500',
      hoverGradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-100',
      description: '16 remedies'
    }
  ];

  // Note: createSlug function already defined above for remedies, reusing for doctors

  // Handle consultation booking with authentication check
  const handleConsultationClick = (doctorName) => {
    const doctorSlug = createSlug(doctorName);
    
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      navigate('/login');
    } else {
      // Redirect to consultation booking page if authenticated
      navigate(`/book-consultation/${doctorSlug}`);
    }
  };

  // Featured doctors data
  const featuredDoctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialization: 'Panchakarma Specialist',
      experience: '15 years',
      rating: 4.9,
      reviews: 245,
      location: 'Mumbai, India',
      consultation_fee: 1500,
      available: true,
      image: 'doctor1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Digestive Health Expert',
      experience: '12 years',
      rating: 4.8,
      reviews: 189,
      location: 'Delhi, India',
      consultation_fee: 1200,
      available: true,
      image: 'doctor2.jpg'
    },
    {
      id: 3,
      name: 'Dr. Meera Patel',
      specialization: 'Women\'s Health Specialist',
      experience: '18 years',
      rating: 4.9,
      reviews: 312,
      location: 'Ahmedabad, India',
      consultation_fee: 1800,
      available: true,
      image: 'doctor3.jpg'
    },
    {
      id: 4,
      name: 'Dr. Arjun Singh',
      specialization: 'Joint & Pain Management',
      experience: '20 years',
      rating: 4.7,
      reviews: 156,
      location: 'Jaipur, India',
      consultation_fee: 1400,
      available: false,
      image: 'doctor4.jpg'
    }
  ];

  const getDifficultyColor = (remedy) => {
    const difficulty = remedy.difficulty ? remedy.difficulty.toLowerCase() : '';
    if (difficulty.includes('easy') || difficulty.includes('simple')) return 'bg-green-100 text-green-700';
    if (difficulty.includes('hard') || difficulty.includes('complex')) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getDifficultyText = (remedy) => {
    const difficulty = remedy.difficulty ? remedy.difficulty.toLowerCase() : '';
    if (difficulty.includes('easy') || difficulty.includes('simple')) return 'Easy';
    if (difficulty.includes('hard') || difficulty.includes('complex')) return 'Hard';
    return 'Medium';
  };

  const getRating = (remedy) => {
    // Generate rating based on remedy name hash
    const hash = remedy.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (Math.abs(hash) % 20 + 40) / 10; // Between 4.0-5.9
  };

  const getReviewCount = (remedy) => {
    // Generate review count based on remedy name hash
    const hash = remedy.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 200 + 50; // Between 50-250 reviews
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(MainHero.png)' }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection direction="scale" delay={0.2}>
            <motion.h1 
              className="text-6xl font-bold mb-4" 
              style={{ fontFamily: 'cursive' }}
              animate={{
                scale: [1, 1.05, 1],
                rotateZ: [0, 1, 0],
                textShadow: [
                  "0 0 0px rgba(255, 255, 255, 0)",
                  "0 0 30px rgba(255, 255, 255, 0.6)",
                  "0 0 0px rgba(255, 255, 255, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Ayur-Seva
            </motion.h1>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.4}>
            <motion.h2 
              className="text-5xl font-bold mb-6"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.02, 1],
                opacity: [0.85, 1, 0.85]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              Discover Ancient Wisdom for Modern Wellness
            </motion.h2>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.6}>
            <motion.p 
              className="text-xl mb-8 text-green-100"
              animate={{
                scale: [1, 1.03, 1],
                y: [0, -4, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              Explore time-tested Ayurvedic remedies and connect with a community of wellness enthusiasts
            </motion.p>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.8}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for symptoms, conditions, or remedies..."
                className="w-full sm:w-96 px-4 py-3 rounded-lg text-gray-900 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300 font-bold placeholder-gray-600"
              />
              <button type="submit" className="bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Search
              </button>
            </form>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={1.0}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                Create Free Account
              </Link>
              <Link to="/remedies" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-medium transition-colors">
                Browse Remedies
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Two Column Layout for Main Content */}
      <TwoColumnLayout 
        sidebar={<Sidebar type="homepage" />}
      >
        {/* Browse by Health Category */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="relative py-16 px-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating circles animation */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-green-100 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute top-20 right-16 w-16 h-16 bg-blue-100 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-16 left-20 w-12 h-12 bg-purple-100 rounded-full opacity-35 animate-pulse" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-50 rounded-full opacity-25 animate-bounce" style={{animationDelay: '0.5s'}}></div>
              
              {/* Gradient waves */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
            
            <div className="relative z-10 text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 rounded-full mb-6 shadow-2xl animate-pulse">
                <span className="text-3xl text-white">🏥</span>
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent mb-6 animate-pulse">
                Browse by Health Category
              </h2>
              <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
                Find remedies tailored to your specific health needs with our comprehensive collection
              </p>
            </div>
            
            <StaggeredContainer className="grid grid-cols-2 md:grid-cols-3 gap-8" staggerDelay={0.1}>
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="group relative bg-white rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-700 border-2 border-gray-100 hover:scale-110 hover:border-green-200 overflow-hidden transform hover:-translate-y-2"
                >
                  {/* Enhanced background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-15 transition-all duration-700 rounded-3xl`}></div>
                  
                  {/* Animated border glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-30 blur-sm transition-all duration-700 -z-10`}></div>
                  
                  {/* Icon container with enhanced styling */}
                  <div className={`relative inline-flex items-center justify-center w-24 h-24 ${category.iconBg} rounded-3xl mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                    <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-25 rounded-3xl transition-all duration-500`}></div>
                    
                    {/* Pulsing ring effect */}
                    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-50 transition-all duration-500 animate-ping`} style={{color: category.gradient.includes('green') ? '#10b981' : category.gradient.includes('blue') ? '#3b82f6' : category.gradient.includes('purple') ? '#8b5cf6' : category.gradient.includes('yellow') ? '#f59e0b' : category.gradient.includes('orange') ? '#f97316' : '#ec4899'}}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300 group-hover:scale-105 transform">
                      {category.name}
                    </h3>
                    <p className="text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                      {category.description}
                    </p>
                  </div>
                  
                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700" style={{animationDelay: '0.3s'}}></div>
                </Link>
              ))}
            </StaggeredContainer>
            
            {/* Enhanced call to action */}
            <div className="text-center mt-12 relative z-10">
              <Link 
                to="/issues" 
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-green-500 via-blue-500 to-green-600 text-white font-bold text-lg rounded-full hover:from-green-600 hover:via-blue-600 hover:to-green-700 transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-1"
              >
                <span>Explore All Categories</span>
                <svg className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Browse Doctors Section */}
        <div className="py-12 px-6 bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 rounded-2xl shadow-lg border border-teal-100 mt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-full mb-4 shadow-lg">
              <span className="text-2xl text-white">🩺</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
              Consult Ayurvedic Doctors
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with verified Ayurvedic practitioners for personalized consultations and expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredDoctors.slice(0, 4).map((doctor) => {
              const slug = createSlug(doctor.name);
              
              return (
                <div key={doctor.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-105">
                  {/* Doctor Image */}
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-teal-100 to-green-200">
                    <Link to={`/doctors/${slug}`}>
                      {/* Default Avatar - Always present as fallback */}
                      <div className="h-full bg-gradient-to-br from-teal-400 to-green-600 flex items-center justify-center">
                        <div className="bg-white bg-opacity-95 rounded-full p-6 shadow-lg">
                          <div className="text-4xl">👨‍⚕️</div>
                        </div>
                      </div>
                      
                      {/* Doctor Image - Only shows if available */}
                      {doctor.image && (
                        <img 
                          src={doctor.image} 
                          alt={doctor.name}
                          className="absolute inset-0 w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Hide the image if it fails to load, showing the default avatar underneath
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </Link>
                    
                    {/* Availability Badge with enhanced styling */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                        doctor.available 
                          ? 'bg-green-500 text-white animate-pulse' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {doctor.available ? '● Available' : '● Busy'}
                      </span>
                    </div>
                    
                    {/* Verified Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                        ✓ Verified
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Doctor Info with enhanced styling */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <Link 
                          to={`/doctors/${slug}`}
                          className="text-xl font-bold text-gray-900 hover:text-teal-600 transition-colors duration-300 block"
                        >
                          {doctor.name}
                        </Link>
                        <p className="text-teal-600 text-sm font-semibold bg-teal-50 px-2 py-1 rounded-full inline-block mt-1">
                          {doctor.specialization}
                        </p>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="ml-1 font-semibold text-gray-700">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs">📍</span>
                        </div>
                        <span className="font-medium">{doctor.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs">🎓</span>
                        </div>
                        <span className="font-medium">{doctor.experience}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleConsultationClick(doctor.name)}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        doctor.available
                          ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!doctor.available}
                    >
                      {doctor.available ? '🩺 Consult Now' : 'Unavailable'}
                    </button>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                </div>
              );
            })}
          </div>
          
          {/* Enhanced View All Doctors button */}
          <div className="text-center">
            <Link 
              to="/doctors" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-full hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>View All Doctors</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-teal-600">50+</div>
              <div className="text-sm text-gray-600">Verified Doctors</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Featured Remedies Section */}
        <div className="relative bg-gray-100 py-8 rounded-lg">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 rounded-lg"
            style={{ backgroundImage: 'url(herbs-spices.jpg)' }}
          ></div>
          <div className="relative">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Featured Remedies</h2>
              <p className="text-gray-600">Discover our most popular natural healing solutions</p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredRemedies.map((remedy, index) => {
                const cleanName = remedy.name.split(' Description')[0];
                const slug = remedy.slug; // Use slug from DB
                const remedyImage = getRemedyImage(remedy.name, index);
                
                return (
                  <Link
                    key={remedy.id}
                    to={`/remedies/${slug}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:scale-105"
                  >
                    <div className="h-48 relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      {/* Default fallback content */}
                      <div className="bg-white bg-opacity-90 rounded-full p-4">
                        <div className="text-3xl">🌿</div>
                      </div>
                      
                      {/* Image overlay - only shows if image loads successfully */}
                      <img 
                        src={remedyImage} 
                        alt={cleanName}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onLoad={(e) => {
                          // Image loaded successfully, show it
                          e.target.style.opacity = '1';
                        }}
                        onError={(e) => {
                          // Image failed to load, keep it hidden
                          e.target.style.opacity = '0';
                        }}
                        style={{ opacity: '0' }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(remedy)}`}>
                          {getDifficultyText(remedy)}
                        </span>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-yellow-500">⭐</span>
                          <span className="ml-1">{getRating(remedy).toFixed(1)}</span>
                          <span className="ml-1">({getReviewCount(remedy)})</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {cleanName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {remedy.description || 'Traditional Ayurvedic remedy for natural healing and wellness.'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-medium text-sm group-hover:text-green-700">Learn more</span>
                        <span className="text-green-600 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            )}

            {/* Recommended Remedies by Condition */}
            <div className="mt-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">Recommended Remedies by Condition</h3>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Explore personalized Ayurvedic remedies tailored to specific health concerns.
                </p>
              </div>
              <StaggeredContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
                {/* Respiratory Remedies */}
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:scale-105 hover:border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <span className="text-3xl">💨</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Recommended Remedies for Respiratory Issues</h4>
                  </div>
                  <div className="space-y-3">
                    {recommendedRemedies.respiratory.map((remedy, index) => (
                      <Link 
                        key={remedy.id}
                        to={`/remedies/${remedy.slug}`}
                        className="block p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-300 group/item hover:scale-102 hover:shadow-md"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 group-hover/item:text-blue-700 transition-colors duration-300">{remedy.name}</span>
                          <span className="text-blue-600 group-hover/item:translate-x-2 transition-transform duration-300 text-lg">→</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 group-hover/item:text-gray-700 transition-colors duration-300">{remedy.description}</p>
                      </Link>
                    ))}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                </div>

                {/* Digestive Issues Remedies */}
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:scale-105 hover:border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <span className="text-3xl">💚</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">Recommended Remedies for Digestive Issues</h4>
                  </div>
                  <div className="space-y-3">
                    {recommendedRemedies.digestive.map((remedy, index) => (
                      <Link 
                        key={remedy.id}
                        to={`/remedies/${remedy.slug}`}
                        className="block p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-300 group/item hover:scale-102 hover:shadow-md"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 group-hover/item:text-green-700 transition-colors duration-300">{remedy.name}</span>
                          <span className="text-green-600 group-hover/item:translate-x-2 transition-transform duration-300 text-lg">→</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 group-hover/item:text-gray-700 transition-colors duration-300">{remedy.description}</p>
                      </Link>
                    ))}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                </div>

                {/* Stress & Anxiety Remedies */}
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:scale-105 hover:border-purple-200">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <span className="text-3xl">🧠</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">Recommended Remedies for Stress & Anxiety</h4>
                  </div>
                  <div className="space-y-3">
                    {recommendedRemedies["stress-anxiety"].map((remedy, index) => (
                      <Link 
                        key={remedy.id}
                        to={`/remedies/${remedy.slug}`}
                        className="block p-4 bg-gray-50 rounded-xl hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all duration-300 group/item hover:scale-102 hover:shadow-md"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 group-hover/item:text-purple-700 transition-colors duration-300">{remedy.name}</span>
                          <span className="text-purple-600 group-hover/item:translate-x-2 transition-transform duration-300 text-lg">→</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 group-hover/item:text-gray-700 transition-colors duration-300">{remedy.description}</p>
                      </Link>
                    ))}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
                </div>
              </StaggeredContainer>
            </div>
          </div>
        </div>

        {/* Community Panel Section */}
        <div className="py-8 bg-gray-50 rounded-lg mt-6">
          <CommunityPanel />
        </div>
      </TwoColumnLayout>

      {/* Community Section - Compact Version */}
      <div className="relative overflow-hidden">
        {/* Simplified gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>
        
        {/* Minimal animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-16 h-16 bg-green-200/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-200/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Compact header */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
                Join Our Growing Community
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Connect with thousands of wellness enthusiasts worldwide
              </p>
            </div>
            
            {/* Compact statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mb-3">
                  <span className="text-xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">15,000+</div>
                <div className="text-gray-600 font-medium">Active Members</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-3">
                  <span className="text-xl">💊</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-1">2,500+</div>
                <div className="text-gray-600 font-medium">Remedies Shared</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-3">
                  <span className="text-xl">⭐</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>

            {/* Compact call-to-action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => isAuthenticated() ? navigate('/community') : navigate('/login')}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">👥</span>
                <span>Join Community</span>
              </button>
              
              <Link 
                to="/community" 
                className="inline-flex items-center px-8 py-3 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="mr-2">💬</span>
                <span>Explore Discussions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;






