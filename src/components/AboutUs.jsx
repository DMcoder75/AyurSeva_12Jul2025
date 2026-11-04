import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Target, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Heart, 
  Shield, 
  Award, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Lightbulb
} from 'lucide-react';

// Enhanced Animation component for staggered entrance with multiple effects
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
      case 'rotate':
        return `${base} ${isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-12'}`;
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

// Advanced Intersection Observer hook with multiple options
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting];
};

// Enhanced animated counter with easing
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.floor(easedProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-green-300 to-blue-300 animate-float"
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

// Mouse trail effect
const MouseTrail = () => {
  const [trail, setTrail] = useState([]);
  const trailRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };

      trailRef.current = [...trailRef.current, newPoint].slice(-10);
      setTrail([...trailRef.current]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const fadeInterval = setInterval(() => {
      trailRef.current = trailRef.current.slice(1);
      setTrail([...trailRef.current]);
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(fadeInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-ping"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: (index + 1) / trail.length * 0.5,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};

// Text reveal animation component
const TextReveal = ({ children, delay = 0 }) => {
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

  return (
    <div ref={setRef} className="overflow-hidden">
      <div className={`transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        {children}
      </div>
    </div>
  );
};

const AboutUs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      {/* Mouse Trail Effect */}
      <MouseTrail />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticles />
        
        {/* Parallax Background Elements */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.02 + 'px',
            top: mousePosition.y * 0.02 + scrollY * 0.1 + 'px',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-bounce" 
          style={{ 
            animationDuration: '6s',
            transform: `translateY(${scrollY * 0.3}px)`
          }} 
        />
        <div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" 
          style={{ 
            animationDelay: '2s',
            transform: `translateY(${scrollY * -0.2}px)`
          }} 
        />
        
        {/* Morphing SVG Shapes */}
        <svg className="absolute top-10 right-10 w-32 h-32 text-green-200/20" viewBox="0 0 100 100">
          <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="currentColor" className="animate-pulse">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 50;360 50 50"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        
        <svg className="absolute bottom-20 left-10 w-24 h-24 text-blue-200/20" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="currentColor" className="animate-bounce">
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.2;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </polygon>
        </svg>
      </div>

      {/* Enhanced Hero Section */}
      <StaggeredContainer delay={200} animation="scale">
        <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-20 overflow-hidden">
          {/* Enhanced Animated Background Patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-12 h-12 border-2 border-white/30 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
            
            {/* Gradient Waves */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-l from-white/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <StaggeredContainer delay={400} animation="scale">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse hover:scale-110 transition-transform duration-500 group">
                  <Leaf className="w-10 h-10 text-white animate-bounce group-hover:rotate-12 transition-transform duration-300" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </StaggeredContainer>
            
            <TextReveal delay={600}>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent">
                About Us - Ayur-seva
              </h1>
            </TextReveal>
            
            <StaggeredContainer delay={800} animation="slideUp">
              <p className="text-2xl md:text-3xl text-green-100 font-light tracking-wide">
                Ancient wisdom, modern wellness
              </p>
            </StaggeredContainer>
            
            {/* Enhanced Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-yellow-300 animate-ping" style={{ animationDelay: '1s' }} />
              <Sparkles className="absolute top-1/3 right-1/3 w-4 h-4 text-blue-200 animate-ping" style={{ animationDelay: '2s' }} />
              <Sparkles className="absolute bottom-1/3 left-1/2 w-5 h-5 text-green-200 animate-ping" style={{ animationDelay: '3s' }} />
              <Zap className="absolute top-1/2 left-1/5 w-4 h-4 text-purple-200 animate-pulse" style={{ animationDelay: '4s' }} />
              <Globe className="absolute bottom-1/4 right-1/4 w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>
      </StaggeredContainer>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Enhanced Mission Section */}
        <StaggeredContainer delay={400} animation="slideLeft">
          <div className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-green-100 hover:shadow-3xl transition-all duration-700 hover:scale-105 group relative overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="text-center mb-8 relative z-10">
                  <StaggeredContainer delay={600} animation="scale">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <Target className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </StaggeredContainer>
                  <TextReveal delay={800}>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      Our Mission
                    </h2>
                  </TextReveal>
                </div>
                <StaggeredContainer delay={1000} animation="slideUp">
                  <p className="text-lg text-gray-700 leading-relaxed text-center group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                    Ayur-seva is dedicated to making the timeless wisdom of Ayurveda accessible, practical, and trustworthy for everyone. Our mission is to empower individuals and families to take charge of their well-being using safe, evidence-based, and traditional Ayurvedic remedies that are easy to prepare and integrate into daily life.
                  </p>
                </StaggeredContainer>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Enhanced Who We Are Section */}
        <StaggeredContainer delay={600} animation="slideRight">
          <div className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-12 border border-green-100 hover:shadow-3xl transition-all duration-700 hover:scale-105 group relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-blue-300 to-purple-300 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-green-300 to-teal-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="flex items-center mb-8 relative z-10">
                  <StaggeredContainer delay={800} animation="scale">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-6 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <Users className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </StaggeredContainer>
                  <TextReveal delay={1000}>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Who We Are
                    </h2>
                  </TextReveal>
                </div>
                <StaggeredContainer delay={1200} animation="slideUp">
                  <p className="text-lg text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                    Ayur-seva is a team of passionate Ayurvedic practitioners, researchers, and wellness enthusiasts who believe in the healing power of nature and the science of Ayurveda. Drawing on classical Ayurvedic texts, modern clinical insights, and community experience, we curate, test, and share remedies that address a wide range of everyday health needs—from digestive health and respiratory care to stress management and skin wellness.
                  </p>
                </StaggeredContainer>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Enhanced What We Offer Section */}
        <StaggeredContainer delay={800} animation="scale">
          <div className="mb-20">
            <div className="text-center mb-12">
              <StaggeredContainer delay={1000} animation="scale">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </StaggeredContainer>
              <TextReveal delay={1200}>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  What We Offer
                </h2>
              </TextReveal>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: CheckCircle,
                  title: "Authoritative Remedies",
                  description: "Our extensive database features detailed, step-by-step remedies for common conditions, each with clear ingredient lists, preparation instructions, dosage guidance, and safety precautions.",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0,
                  animation: "slideLeft"
                },
                {
                  icon: Heart,
                  title: "Accessible Knowledge",
                  description: "We translate complex Ayurvedic principles into practical advice, using common kitchen ingredients and easy-to-understand measurements, making Ayurveda approachable for beginners and experts alike.",
                  gradient: "from-red-500 to-pink-500",
                  delay: 200,
                  animation: "slideRight"
                },
                {
                  icon: Shield,
                  title: "Transparency & Safety",
                  description: "Every remedy includes information on possible side effects, contraindications, and drug interactions, so you can make informed choices for yourself and your loved ones.",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 400,
                  animation: "slideLeft"
                },
                {
                  icon: Award,
                  title: "Evidence-Based Approach",
                  description: "Our content is grounded in both classical Ayurvedic sources and modern research, ensuring recommendations are safe, relevant, and effective for today's lifestyles.",
                  gradient: "from-yellow-500 to-orange-500",
                  delay: 600,
                  animation: "slideRight"
                }
              ].map((item, index) => (
                <StaggeredContainer key={index} delay={1400 + item.delay} animation={item.animation}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 group relative overflow-hidden">
                    {/* Animated Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                    
                    {/* Floating Particles on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                      <div className="absolute top-8 right-8 w-1 h-1 bg-current rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-current rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                    </div>
                    
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative z-10`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300 relative z-10">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 relative z-10">
                      {item.description}
                    </p>
                  </div>
                </StaggeredContainer>
              ))}
            </div>
          </div>
        </StaggeredContainer>

        {/* Enhanced Our Values Section */}
        <StaggeredContainer delay={1200} animation="scale">
          <div className="mb-20">
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl p-12 relative overflow-hidden">
              {/* Enhanced Background Animation */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-green-300 to-blue-300 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s' }} />
              </div>
              
              <div className="text-center mb-12 relative z-10">
                <StaggeredContainer delay={1400} animation="scale">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce hover:scale-110 transition-transform duration-500">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </StaggeredContainer>
                <TextReveal delay={1600}>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    Our Values
                  </h2>
                </TextReveal>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    icon: Shield,
                    title: "Integrity",
                    description: "We are committed to accuracy, transparency, and respect for both tradition and science.",
                    gradient: "from-blue-500 to-indigo-500",
                    delay: 0,
                    animation: "slideUp"
                  },
                  {
                    icon: Heart,
                    title: "Empowerment",
                    description: "We believe everyone deserves access to reliable health information and the tools to care for themselves naturally.",
                    gradient: "from-red-500 to-pink-500",
                    delay: 200,
                    animation: "scale"
                  },
                  {
                    icon: Users,
                    title: "Community",
                    description: "Ayur-seva is more than a resource—it's a supportive community for sharing, learning, and growing together on the path to wellness.",
                    gradient: "from-green-500 to-teal-500",
                    delay: 400,
                    animation: "slideUp"
                  }
                ].map((value, index) => (
                  <StaggeredContainer key={index} delay={1800 + value.delay} animation={value.animation}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-700 hover:scale-110 hover:rotate-2 group relative overflow-hidden">
                      {/* Magnetic Effect Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                      
                      <div className={`w-14 h-14 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 group-hover:scale-125 transition-all duration-500 relative z-10`}>
                        <value.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300 relative z-10">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 relative z-10">
                        {value.description}
                      </p>
                    </div>
                  </StaggeredContainer>
                ))}
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Enhanced Why Trust Section with Advanced Counter Animation */}
        <StaggeredContainer delay={1600} animation="slideUp">
          <div className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 border border-blue-100 hover:shadow-3xl transition-all duration-700 hover:scale-105 group relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-l from-indigo-300 to-purple-300 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="flex items-center mb-8 relative z-10">
                  <StaggeredContainer delay={1800} animation="scale">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-6 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <Award className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </StaggeredContainer>
                  <TextReveal delay={2000}>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Why Trust Ayur-seva?
                    </h2>
                  </TextReveal>
                </div>
                
                <StaggeredContainer delay={2200} animation="slideUp">
                  <p className="text-lg text-gray-700 leading-relaxed mb-8 group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                    Our remedies are carefully reviewed and updated based on the latest research and Ayurvedic practice. We prioritize clarity, safety, and real-world usability, so you can confidently bring Ayurveda into your daily routine.
                  </p>
                </StaggeredContainer>
                
                {/* Enhanced Trust Statistics */}
                <div className="grid grid-cols-3 gap-8 text-center relative z-10">
                  <StaggeredContainer delay={2400} animation="scale">
                    <div className="group/stat hover:scale-110 transition-transform duration-300 p-4 rounded-xl hover:bg-green-50">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        <AnimatedCounter end={98} suffix="%" />
                      </div>
                      <div className="text-gray-600 group-hover/stat:text-gray-800 transition-colors duration-300">Success Rate</div>
                    </div>
                  </StaggeredContainer>
                  
                  <StaggeredContainer delay={2600} animation="scale">
                    <div className="group/stat hover:scale-110 transition-transform duration-300 p-4 rounded-xl hover:bg-blue-50">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        <AnimatedCounter end={2500} suffix="+" />
                      </div>
                      <div className="text-gray-600 group-hover/stat:text-gray-800 transition-colors duration-300">Remedies</div>
                    </div>
                  </StaggeredContainer>
                  
                  <StaggeredContainer delay={2800} animation="scale">
                    <div className="group/stat hover:scale-110 transition-transform duration-300 p-4 rounded-xl hover:bg-purple-50">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        <AnimatedCounter end={15000} suffix="+" />
                      </div>
                      <div className="text-gray-600 group-hover/stat:text-gray-800 transition-colors duration-300">Happy Users</div>
                    </div>
                  </StaggeredContainer>
                </div>
              </div>
            </div>
          </div>
        </StaggeredContainer>

        {/* Enhanced Call-to-Action Section */}
        <StaggeredContainer delay={1800} animation="scale">
          <div className="relative">
            <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-12 text-white text-center relative overflow-hidden shadow-2xl">
              {/* Enhanced Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-ping" style={{ animationDelay: '2s' }} />
                
                {/* Floating Icons */}
                <Lightbulb className="absolute top-10 right-10 w-8 h-8 text-white/30 animate-bounce" style={{ animationDelay: '1s' }} />
                <Heart className="absolute bottom-10 left-10 w-6 h-6 text-white/30 animate-pulse" style={{ animationDelay: '2s' }} />
                <Sparkles className="absolute top-1/3 left-1/4 w-5 h-5 text-white/30 animate-ping" style={{ animationDelay: '3s' }} />
              </div>
              
              <div className="relative z-10">
                <StaggeredContainer delay={2000} animation="scale">
                  <h2 className="text-5xl font-bold mb-6 animate-pulse">Join Us</h2>
                </StaggeredContainer>
                
                <StaggeredContainer delay={2200} animation="slideUp">
                  <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                    Explore our growing library of remedies, tips, and educational content. Whether you're new to Ayurveda or a lifelong practitioner, Ayur-seva is your trusted companion on the journey to holistic health.
                  </p>
                </StaggeredContainer>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <StaggeredContainer delay={2400} animation="slideLeft">
                    <Link 
                      to="/remedies" 
                      className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Browse Remedies</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                    </Link>
                  </StaggeredContainer>
                  
                  <StaggeredContainer delay={2600} animation="slideRight">
                    <Link 
                      to="/community" 
                      className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Join Community</span>
                      <Users className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    </Link>
                  </StaggeredContainer>
                </div>
              </div>
            </div>
            
            <StaggeredContainer delay={2800} animation="slideUp">
              <div className="text-center mt-8">
                <p className="text-2xl font-light text-gray-600 italic">
                  Ayur-seva—Ancient wisdom, modern wellness.
                </p>
              </div>
            </StaggeredContainer>
          </div>
        </StaggeredContainer>
      </div>
      
      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-5deg); }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;

