import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageSquare,
  Globe,
  Heart,
  Sparkles,
  Zap
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
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.4 + 0.1
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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    customSubject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const [errors, setErrors] = useState({});

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'remedy', label: 'Remedy Questions' },
    { value: 'consultation', label: 'Doctor Consultation' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership/Business' },
    { value: 'feedback', label: 'Feedback/Suggestions' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (formData.subject === 'other' && !formData.customSubject.trim()) {
      newErrors.customSubject = 'Please specify the subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would send the data to your backend
      console.log('Form submitted:', formData);
      
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          customSubject: '',
          message: ''
        });
        setFormStatus({ isSubmitting: false, isSubmitted: false, error: null });
      }, 3000);
      
    } catch (error) {
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        error: 'Failed to send message. Please try again.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse top-10 left-10" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-bounce bottom-20 right-20" style={{ animationDuration: '6s' }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }} />
        
        {/* Floating Icons */}
        <Sparkles className="absolute top-20 right-1/4 w-6 h-6 text-green-300/30 animate-ping" style={{ animationDelay: '1s' }} />
        <Zap className="absolute bottom-1/3 left-1/4 w-5 h-5 text-blue-300/30 animate-pulse" style={{ animationDelay: '2s' }} />
        <Heart className="absolute top-1/3 right-1/3 w-4 h-4 text-purple-300/30 animate-bounce" style={{ animationDelay: '3s' }} />
      </div>

      {/* Hero Section */}
      <StaggeredContainer delay={200} animation="scale">
        <div className="relative bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-20 overflow-hidden">
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
                  <MessageSquare className="w-10 h-10 text-white animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </StaggeredContainer>
            
            <StaggeredContainer delay={600} animation="slideUp">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent">
                Contact Us
              </h1>
            </StaggeredContainer>
            
            <StaggeredContainer delay={800} animation="slideUp">
              <p className="text-2xl md:text-3xl text-green-100 font-light tracking-wide">
                We're here to help you on your wellness journey
              </p>
            </StaggeredContainer>
          </div>
        </div>
      </StaggeredContainer>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Contact Information Cards */}
        <StaggeredContainer delay={400} animation="slideUp">
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions about Ayurveda or need personalized guidance? We're here to help you discover the path to natural wellness.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "info@ayur-seva.com",
                  description: "Send us your questions anytime",
                  gradient: "from-green-500 to-emerald-500",
                  delay: 0,
                  href: "mailto:info@ayur-seva.com"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "+91 9513886363",
                  description: "Speak with our wellness experts",
                  gradient: "from-blue-500 to-cyan-500",
                  delay: 200,
                  href: "tel:+919513886363"
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  content: "Rishikesh, Uttarakhand",
                  description: "Ganga View Complex, Tapovan",
                  gradient: "from-purple-500 to-pink-500",
                  delay: 400,
                  href: "#map-section"
                }
              ].map((item, index) => (
                <StaggeredContainer key={index} delay={600 + item.delay} animation="slideUp">
                  <a 
                    href={item.href}
                    className="block bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 group relative overflow-hidden"
                  >
                    {/* Animated Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
                    
                    <div className={`w-14 h-14 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative z-10`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 relative z-10">
                      {item.title}
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 mb-2 relative z-10">
                      {item.content}
                    </p>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 relative z-10">
                      {item.description}
                    </p>
                  </a>
                </StaggeredContainer>
              ))}
            </div>
          </div>
        </StaggeredContainer>

        {/* Contact Form and Map Section */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <StaggeredContainer delay={800} animation="slideLeft">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-green-300 to-blue-300 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Send us a Message
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you soon
                  </p>
                </div>

                {formStatus.isSubmitted && (
                  <StaggeredContainer delay={0} animation="scale">
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <p className="text-green-800">Thank you! Your message has been sent successfully.</p>
                    </div>
                  </StaggeredContainer>
                )}

                {formStatus.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                    <p className="text-red-800">{formStatus.error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                  </div>

                  {/* Custom Subject Field */}
                  {formData.subject === 'other' && (
                    <StaggeredContainer delay={0} animation="slideUp">
                      <div>
                        <label htmlFor="customSubject" className="block text-sm font-medium text-gray-700 mb-2">
                          Please specify *
                        </label>
                        <input
                          type="text"
                          id="customSubject"
                          name="customSubject"
                          value={formData.customSubject}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                            errors.customSubject ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Please specify your subject"
                        />
                        {errors.customSubject && <p className="mt-1 text-sm text-red-600">{errors.customSubject}</p>}
                      </div>
                    </StaggeredContainer>
                  )}

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus.isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </StaggeredContainer>

          {/* Map Section */}
          <StaggeredContainer delay={1000} animation="slideRight">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-l from-green-300 to-teal-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Visit Our Location
                  </h3>
                  <p className="text-gray-600">
                    Find us in the spiritual heart of Rishikesh
                  </p>
                </div>

                {/* Address Information */}
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Our Address</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Ganga View Complex,<br />
                        Laxman Jhula Road,<br />
                        Tapovan, Rishikesh – 249192<br />
                        Uttarakhand, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Office Hours</h4>
                      <div className="text-gray-700 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <div id="map-section" className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3462.5234567890123!2d78.3176!3d30.1086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093e67cf93f111%3A0x1234567890abcdef!2sLaxman%20Jhula%20Rd%2C%20Tapovan%2C%20Rishikesh%2C%20Uttarakhand%20249192!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ayur-seva Location"
                    className="hover:scale-105 transition-transform duration-500"
                  ></iframe>
                </div>

                {/* Directions Button */}
                <div className="mt-6 text-center">
                  <a
                    href="https://maps.google.com/?q=Ganga+View+Complex,+Laxman+Jhula+Road,+Tapovan,+Rishikesh,+Uttarakhand+249192"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  >
                    <Globe className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </StaggeredContainer>
        </div>

        {/* Additional Information Section */}
        <StaggeredContainer delay={1200} animation="slideUp">
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl p-12 relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-green-300 to-blue-300 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  We're Here to Help
                </h3>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Whether you're new to Ayurveda or seeking specific guidance, our team of experienced practitioners is ready to support your wellness journey. We typically respond to all inquiries within 24 hours.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quick Response</h4>
                    <p className="text-gray-600">We respond within 24 hours</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expert Guidance</h4>
                    <p className="text-gray-600">Certified Ayurvedic practitioners</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personalized Care</h4>
                    <p className="text-gray-600">Tailored wellness solutions</p>
                  </div>
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

export default ContactUs;

