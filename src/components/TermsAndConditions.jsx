import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Scale, 
  Shield, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Zap,
  Heart,
  Info
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
          className="absolute rounded-full bg-gradient-to-r from-red-300 to-orange-300 animate-float"
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

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-red-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-200/20 to-red-200/20 rounded-full blur-3xl animate-bounce bottom-20 right-20" style={{ animationDuration: '6s' }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }} />
        
        {/* Floating Icons */}
        <Sparkles className="absolute top-20 right-1/4 w-6 h-6 text-red-300/30 animate-ping" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-1/3 left-1/4 w-5 h-5 text-orange-300/30 animate-pulse" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-1/3 right-1/3 w-4 h-4 text-yellow-300/30 animate-bounce" style={{ animationDelay: '3s' }} />
      </div>

      {/* Hero Section */}
      <StaggeredContainer delay={200} animation="scale">
        <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-20 overflow-hidden">
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
                  <Scale className="w-10 h-10 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </StaggeredContainer>
            
            <StaggeredContainer delay={600} animation="slideUp">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
                Terms & Conditions
              </h1>
            </StaggeredContainer>
            
            <StaggeredContainer delay={800} animation="slideUp">
              <p className="text-2xl md:text-3xl text-orange-100 font-light tracking-wide">
                Important legal information for using our wellness portal
              </p>
            </StaggeredContainer>
            
            <StaggeredContainer delay={1000} animation="slideUp">
              <div className="mt-8 text-lg text-orange-200">
                <p>Last Updated: July 10, 2025</p>
              </div>
            </StaggeredContainer>
          </div>
        </div>
      </StaggeredContainer>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Important Disclaimer Section */}
        <StaggeredContainer delay={400} animation="slideUp">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-red-300 to-orange-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Important Disclaimer
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <div className="bg-red-50 border-l-4 border-red-400 p-6 my-6 rounded-r-lg">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    <p className="text-red-800 font-bold text-lg">WELLNESS PORTAL - INFORMATIONAL PURPOSES ONLY</p>
                  </div>
                  <div className="text-red-700 space-y-3">
                    <p className="font-semibold">
                      Ayur-seva is a wellness portal providing information related to Ayurvedic remedies, health, and general well-being. The content provided on this Service is for informational purposes only.
                    </p>
                    <p className="font-semibold">
                      It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>
                    <p className="font-semibold">
                      Never disregard professional medical advice or delay in seeking it because of something you have read on this Service.
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-6 rounded-r-lg">
                  <div className="flex items-center mb-3">
                    <XCircle className="w-6 h-6 text-yellow-600 mr-2" />
                    <p className="text-yellow-800 font-bold text-lg">NO OBLIGATIONS ON AYUR-SEVA</p>
                  </div>
                  <div className="text-yellow-700 space-y-3">
                    <p className="font-semibold">
                      By using this Service, you acknowledge and agree that you are using it at your own risk and interest. You understand that Ayur-seva is a wellness portal providing general information and is not a medical service provider.
                    </p>
                    <p className="font-semibold">
                      We bear no obligations or liabilities for any outcomes resulting from your use of the information or remedies suggested on this platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* User Responsibility Section */}
        <StaggeredContainer delay={600} animation="slideLeft">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  User Responsibility and Risk
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-6">
                  Users of this Service acknowledge and agree that they are solely responsible for their health decisions. Any reliance you place on the information provided through the Service is strictly at your own risk.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100">
                    <div className="flex items-center mb-3">
                      <XCircle className="w-6 h-6 text-orange-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">What We Don't Provide</h3>
                    </div>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Medical diagnosis or treatment</li>
                      <li>• Professional medical advice</li>
                      <li>• Guaranteed health outcomes</li>
                      <li>• Emergency medical services</li>
                      <li>• Personalized medical consultations</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-6 rounded-2xl border border-yellow-100">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="w-6 h-6 text-yellow-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">Your Responsibilities</h3>
                    </div>
                    <ul className="text-gray-700 space-y-2">
                      <li>• Consult healthcare professionals</li>
                      <li>• Use information at your own risk</li>
                      <li>• Make informed health decisions</li>
                      <li>• Verify information independently</li>
                      <li>• Follow professional medical advice</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Service Terms Section */}
        <StaggeredContainer delay={800} animation="slideRight">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-yellow-300 to-red-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  Service Terms
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 rounded-r-lg">
                  <div className="flex items-center mb-3">
                    <Info className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-800 font-semibold">Service Agreement</p>
                  </div>
                  <p className="text-blue-700">
                    Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. By accessing or using the Service you agree to be bound by these Terms.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informational Only</h4>
                    <p className="text-gray-600 text-sm">Content is for educational purposes only</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">No Warranties</h4>
                    <p className="text-gray-600 text-sm">Service provided "as is" without guarantees</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Limited Liability</h4>
                    <p className="text-gray-600 text-sm">We are not liable for any damages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Intellectual Property Section */}
        <StaggeredContainer delay={1000} animation="slideUp">
          <div className="mb-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-l from-red-300 to-pink-300 rounded-full blur-2xl animate-pulse" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Intellectual Property & Links
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Content</h3>
                    <p className="mb-4">
                      The Service and its original content, features and functionality are and will remain the exclusive property of Ayur-seva and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Links</h3>
                    <p className="mb-4">
                      Our Service may contain links to third-party websites or services that are not owned or controlled by Ayur-seva. We have no control over and assume no responsibility for the content or practices of any third-party sites.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <ExternalLink className="w-5 h-5 text-gray-600 mr-2" />
                    <p className="text-gray-800 font-semibold">Third-Party Disclaimer</p>
                  </div>
                  <p className="text-gray-700">
                    We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit. We are not responsible for their content or practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Contact Information */}
        <StaggeredContainer delay={1200} animation="scale">
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-red-300 to-orange-300 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Questions About These Terms?
              </h3>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                If you have any questions about these Terms and Conditions, please contact us using any of the methods below.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                  <p className="text-gray-600">info@ayur-seva.com</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-600">+91 9513886363</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
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

export default TermsAndConditions;

