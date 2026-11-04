import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';

// Animation component for staggered entrance
const StaggeredContainer = ({ children, delay = 0, animation = 'slideUp' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, delay]);

  const getAnimationClasses = () => {
    const base = 'transition-all duration-1000 ease-out';
    switch (animation) {
      case 'slideUp':
        return `${base} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;
      case 'slideLeft':
        return `${base} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`;
      case 'slideRight':
        return `${base} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`;
      case 'scale':
        return `${base} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`;
      default:
        return `${base} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
    }
  };

  return (
    <div ref={setRef} className={getAnimationClasses()}>
      {children}
    </div>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-300 to-purple-300 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-green-200/20 to-teal-200/20 rounded-full blur-3xl animate-bounce bottom-20 right-20" style={{ animationDuration: '6s' }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }} />
        
        {/* Floating Icons */}
        <Sparkles className="absolute top-20 right-1/4 w-6 h-6 text-blue-300/30 animate-ping" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-1/3 left-1/4 w-5 h-5 text-purple-300/30 animate-pulse" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-1/3 right-1/3 w-4 h-4 text-green-300/30 animate-bounce" style={{ animationDelay: '3s' }} />
      </div>

      {/* Hero Section */}
      <StaggeredContainer delay={200} animation="scale">
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20 overflow-hidden">
          {/* Animated Background Patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-12 h-12 border-2 border-white/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <StaggeredContainer delay={400} animation="scale">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse hover:scale-110 transition-transform duration-500">
                  <Shield className="w-10 h-10 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </StaggeredContainer>
            
            <StaggeredContainer delay={600} animation="slideUp">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </StaggeredContainer>
            
            <StaggeredContainer delay={800} animation="slideUp">
              <p className="text-2xl md:text-3xl text-blue-100 font-light tracking-wide">
                Your privacy and data protection matter to us
              </p>
            </StaggeredContainer>
            
            <StaggeredContainer delay={1000} animation="slideUp">
              <div className="mt-8 text-lg text-blue-200">
                <p>Last Updated: July 10, 2025</p>
              </div>
            </StaggeredContainer>
          </div>
        </div>
      </StaggeredContainer>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Introduction Section */}
        <StaggeredContainer delay={400} animation="slideUp">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-blue-300 to-purple-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Introduction
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  At Ayur-seva, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, including any other media form, media channel, mobile website, or mobile application related or connected thereto.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 font-semibold">Important Notice</p>
                  </div>
                  <p className="text-yellow-700 mt-2">
                    IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, PLEASE DO NOT ACCESS THE SITE.
                  </p>
                </div>
                
                <p>
                  We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
                </p>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Information Collection Section */}
        <StaggeredContainer delay={600} animation="slideLeft">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-green-300 to-blue-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Information We Collect
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Data</h3>
                  <p className="text-gray-700">
                    Personally identifiable information such as your name, email address, and telephone number that you voluntarily provide when you register or participate in activities on our site.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Derivative Data</h3>
                  <p className="text-gray-700">
                    Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, and access times.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Data</h3>
                  <p className="text-gray-700">
                    Financial information related to your payment method when you make purchases. We store only very limited financial information, with most data handled by our payment processors.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-2xl border border-pink-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Device Data</h3>
                  <p className="text-gray-700">
                    Device information such as your mobile device ID, model, manufacturer, and location information if you access our site from a mobile device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* How We Use Information Section */}
        <StaggeredContainer delay={800} animation="slideRight">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  How We Use Your Information
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    "Create and manage your account",
                    "Process payments and transactions",
                    "Send you newsletters and updates",
                    "Improve our services and user experience",
                    "Respond to customer service requests",
                    "Monitor and analyze usage trends",
                    "Prevent fraudulent transactions",
                    "Comply with legal requirements"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <CheckCircle className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Data Security Section */}
        <StaggeredContainer delay={1000} animation="slideUp">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-l from-blue-300 to-green-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Data Security
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-800 font-semibold">Security Notice</p>
                  </div>
                  <p className="text-blue-700 mt-2">
                    Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Contact Information */}
        <StaggeredContainer delay={1200} animation="scale">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-300 to-green-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Questions About This Policy?
              </h3>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                If you have questions or comments about this Privacy Policy, please don't hesitate to contact us using any of the methods below.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                  <p className="text-gray-600">info@ayur-seva.com</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-600">+91 9513886363</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
                  <p className="text-gray-600">Rishikesh, Uttarakhand</p>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>
      </div>
      
      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(3deg); }
          66% { transform: translateY(4px) rotate(-3deg); }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;

