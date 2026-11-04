import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

const DoctorDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback doctor data for consistent functionality
  const fallbackDoctors = [
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
      bio: 'Dr. Priya Sharma is a renowned Panchakarma specialist with over 15 years of experience in traditional Ayurvedic treatments. She specializes in detoxification therapies and chronic disease management using authentic Ayurvedic principles. Her approach combines traditional wisdom with modern understanding to provide comprehensive healthcare solutions.',
      education: 'BAMS, MD (Ayurveda)',
      languages: ['Hindi', 'English', 'Marathi'],
      image: 'doctor1.jpg',
      clinic_address: 'Ayur Wellness Center, Bandra West, Mumbai - 400050',
      phone: '+91 98765 43210',
      email: 'dr.priya@ayurwellness.com',
      consultation_hours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      specialties: ['Panchakarma Detox', 'Chronic Disease Management', 'Stress Management', 'Digestive Disorders'],
      achievements: ['Best Ayurvedic Doctor Award 2022', '15+ Years Experience', '1000+ Successful Treatments'],
      treatment_approach: 'Dr. Priya follows a holistic approach combining Panchakarma therapies with personalized diet and lifestyle recommendations.'
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
      bio: 'Dr. Rajesh Kumar specializes in Ayurvedic treatment of digestive disorders. His expertise includes treating IBS, gastritis, and other gastrointestinal conditions using traditional methods. He has successfully treated thousands of patients with chronic digestive issues using personalized Ayurvedic protocols.',
      education: 'BAMS, MD (Kayachikitsa)',
      languages: ['Hindi', 'English', 'Punjabi'],
      image: 'doctor2.jpg',
      clinic_address: 'Ayur Digestive Care, Connaught Place, New Delhi - 110001',
      phone: '+91 98765 43211',
      email: 'dr.rajesh@ayurdigestive.com',
      consultation_hours: 'Mon-Fri: 10:00 AM - 7:00 PM, Sat: 10:00 AM - 2:00 PM',
      specialties: ['IBS Treatment', 'Gastritis Management', 'Acid Reflux', 'Digestive Detox'],
      achievements: ['Digestive Health Specialist', '12+ Years Experience', '800+ Happy Patients'],
      treatment_approach: 'Dr. Rajesh uses a combination of herbal medicines, dietary modifications, and lifestyle changes for optimal digestive health.'
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
      bio: 'Dr. Meera Patel is an expert in Ayurvedic gynecology and women\'s health. She provides comprehensive care for menstrual disorders, fertility issues, and pregnancy-related concerns. Her gentle approach and deep understanding of women\'s health issues have made her a trusted practitioner among women of all ages.',
      education: 'BAMS, MD (Prasuti Tantra)',
      languages: ['Hindi', 'English', 'Gujarati'],
      image: 'doctor3.jpg',
      clinic_address: 'Women\'s Ayur Care, Satellite, Ahmedabad - 380015',
      phone: '+91 98765 43212',
      email: 'dr.meera@womensayurcare.com',
      consultation_hours: 'Mon-Sat: 9:00 AM - 5:00 PM',
      specialties: ['PCOS Treatment', 'Fertility Enhancement', 'Menstrual Disorders', 'Pregnancy Care'],
      achievements: ['Women\'s Health Expert', '18+ Years Experience', '1200+ Successful Cases'],
      treatment_approach: 'Dr. Meera provides personalized treatment plans focusing on hormonal balance and overall women\'s wellness.'
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
      bio: 'Dr. Arjun Singh specializes in Ayurvedic treatment of joint disorders and pain management. His expertise includes arthritis, back pain, and sports injuries using traditional therapies. With 20 years of experience, he has developed unique treatment protocols for chronic pain conditions.',
      education: 'BAMS, MD (Shalya Tantra)',
      languages: ['Hindi', 'English', 'Rajasthani'],
      image: 'doctor4.jpg',
      clinic_address: 'Joint Care Ayurveda, Malviya Nagar, Jaipur - 302017',
      phone: '+91 98765 43213',
      email: 'dr.arjun@jointcareayur.com',
      consultation_hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      specialties: ['Arthritis Treatment', 'Back Pain Relief', 'Sports Injuries', 'Joint Mobility'],
      achievements: ['Pain Management Expert', '20+ Years Experience', '2000+ Pain-Free Patients'],
      treatment_approach: 'Dr. Arjun combines traditional Ayurvedic therapies with modern physiotherapy techniques for comprehensive pain relief.'
    },
    {
      id: 5,
      name: 'Dr. Kavita Reddy',
      specialization: 'Skin & Hair Specialist',
      experience: '10 years',
      rating: 4.8,
      reviews: 203,
      location: 'Bangalore, India',
      consultation_fee: 1300,
      available: true,
      bio: 'Dr. Kavita Reddy is an expert in Ayurvedic dermatology and trichology. She treats various skin conditions, hair loss, and cosmetic concerns using natural Ayurvedic methods. Her holistic approach addresses the root cause of skin and hair problems for lasting results.',
      education: 'BAMS, MD (Roga Nidana)',
      languages: ['Hindi', 'English', 'Telugu', 'Kannada'],
      image: 'doctor5.jpg',
      clinic_address: 'Skin & Hair Ayurveda, Koramangala, Bangalore - 560034',
      phone: '+91 98765 43214',
      email: 'dr.kavita@skinhairayur.com',
      consultation_hours: 'Mon-Sat: 10:00 AM - 7:00 PM',
      specialties: ['Acne Treatment', 'Hair Loss Prevention', 'Skin Rejuvenation', 'Anti-Aging'],
      achievements: ['Dermatology Specialist', '10+ Years Experience', '1500+ Glowing Transformations'],
      treatment_approach: 'Dr. Kavita uses herbal formulations and lifestyle modifications to achieve natural beauty and healthy skin.'
    },
    {
      id: 6,
      name: 'Dr. Suresh Gupta',
      specialization: 'Respiratory Health Expert',
      experience: '14 years',
      rating: 4.6,
      reviews: 178,
      location: 'Pune, India',
      consultation_fee: 1100,
      available: true,
      bio: 'Dr. Suresh Gupta specializes in Ayurvedic treatment of respiratory disorders including asthma, bronchitis, and allergies. He combines traditional therapies with modern diagnostic approaches to provide effective treatment for breathing-related issues.',
      education: 'BAMS, MD (Swasthavritta)',
      languages: ['Hindi', 'English', 'Marathi'],
      image: 'doctor6.jpg',
      clinic_address: 'Respiratory Ayur Care, Pune Camp, Pune - 411001',
      phone: '+91 98765 43215',
      email: 'dr.suresh@respiratoryayur.com',
      consultation_hours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      specialties: ['Asthma Management', 'Bronchitis Treatment', 'Allergy Relief', 'Breathing Therapy'],
      achievements: ['Respiratory Expert', '14+ Years Experience', '1000+ Breathing Better'],
      treatment_approach: 'Dr. Suresh focuses on strengthening respiratory immunity and clearing airways using traditional Ayurvedic methods.'
    }
  ];

  // Function to create URL-friendly slug from doctor name
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    fetchDoctor();
  }, [slug]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first
      const { data: supabaseDoctor, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !supabaseDoctor) {
        // Use fallback data
        const foundDoctor = fallbackDoctors.find(doc => createSlug(doc.name) === slug);
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError('Doctor not found');
        }
      } else {
        setDoctor(supabaseDoctor);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      // Try fallback data
      const foundDoctor = fallbackDoctors.find(doc => createSlug(doc.name) === slug);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      } else {
        setError('Doctor not found');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle consultation booking with authentication check
  const handleConsultationClick = (e) => {
    e.preventDefault();
    
    if (!doctor.available) {
      return; // Do nothing if doctor is not available
    }
    
    if (!isAuthenticated()) {
      // Redirect to login page if not authenticated
      navigate('/login');
    } else {
      // Redirect to consultation booking page if authenticated
      navigate(`/book-consultation/${slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist.</p>
          <Link
            to="/doctors"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse All Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span>›</span>
            <Link to="/doctors" className="hover:text-green-600">Doctors</Link>
            <span>›</span>
            <span className="text-gray-900">{doctor.name}</span>
          </nav>
        </div>
      </div>

      {/* Doctor Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 relative overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-green-200">
                    <img 
                      src={`/${doctor.image}`} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" style={{display: 'none'}}>
                      <div className="text-4xl text-white">👨‍⚕️</div>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                      <p className="text-green-600 font-medium">{doctor.specialization}</p>
                      <p className="text-gray-600">{doctor.education}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-lg font-semibold text-gray-900">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        {doctor.rating}
                      </div>
                      <p className="text-sm text-gray-600">{doctor.reviews} reviews</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🎓</span>
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🗣️</span>
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>₹{doctor.consultation_fee} consultation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.name.split(' ').pop()}</h2>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {doctor.specialties.map((specialty, index) => (
                  <div key={index} className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium text-center">
                    {specialty}
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment Approach */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Treatment Approach</h2>
              <p className="text-gray-700 leading-relaxed">{doctor.treatment_approach}</p>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-2">
                {doctor.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Consultation Info */}
          <div className="space-y-6">
            {/* Consultation Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">₹{doctor.consultation_fee}</div>
                <p className="text-gray-600">Consultation Fee</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.available ? 'Available' : 'Busy'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-gray-900">Within 2 hours</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConsultationClick}
                  className={`block w-full py-3 px-4 rounded-lg font-medium transition-colors text-center ${
                    doctor.available
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!doctor.available}
                >
                  {doctor.available ? 'Book Consultation' : 'Currently Unavailable'}
                </button>
                <button className="w-full border border-green-600 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Send Message
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Clinic Address:</p>
                  <p className="text-gray-900">{doctor.clinic_address}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Phone:</p>
                  <p className="text-gray-900">{doctor.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Email:</p>
                  <p className="text-gray-900">{doctor.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Consultation Hours:</p>
                  <p className="text-gray-900">{doctor.consultation_hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;

