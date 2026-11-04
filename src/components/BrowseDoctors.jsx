import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';
import AnimatedCard from './AnimatedCard';
import AnimatedButton from './AnimatedButton';
import StaggeredContainer from './StaggeredContainer';

const BrowseDoctors = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  // Function to create URL-friendly slug from doctor name
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

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
      bio: 'Dr. Priya Sharma is a renowned Panchakarma specialist with over 15 years of experience in traditional Ayurvedic treatments. She specializes in detoxification therapies and chronic disease management.',
      education: 'BAMS, MD (Ayurveda)',
      languages: ['Hindi', 'English', 'Marathi'],
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
      bio: 'Dr. Rajesh Kumar specializes in Ayurvedic treatment of digestive disorders. His expertise includes treating IBS, gastritis, and other gastrointestinal conditions using traditional methods.',
      education: 'BAMS, MD (Kayachikitsa)',
      languages: ['Hindi', 'English', 'Punjabi'],
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
      bio: 'Dr. Meera Patel is an expert in Ayurvedic gynecology and women\'s health. She provides comprehensive care for menstrual disorders, fertility issues, and pregnancy-related concerns.',
      education: 'BAMS, MD (Prasuti Tantra)',
      languages: ['Hindi', 'English', 'Gujarati'],
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
      bio: 'Dr. Arjun Singh specializes in Ayurvedic treatment of joint disorders and pain management. His expertise includes arthritis, back pain, and sports injuries using traditional therapies.',
      education: 'BAMS, MD (Shalya Tantra)',
      languages: ['Hindi', 'English', 'Rajasthani'],
      image: 'doctor4.jpg'
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
      bio: 'Dr. Kavita Reddy is an expert in Ayurvedic dermatology and trichology. She treats various skin conditions, hair loss, and cosmetic concerns using natural Ayurvedic methods.',
      education: 'BAMS, MD (Roga Nidana)',
      languages: ['Hindi', 'English', 'Telugu', 'Kannada'],
      image: 'doctor5.jpg'
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
      bio: 'Dr. Suresh Gupta specializes in Ayurvedic treatment of respiratory disorders including asthma, bronchitis, and allergies. He combines traditional therapies with modern diagnostic approaches.',
      education: 'BAMS, MD (Swasthavritta)',
      languages: ['Hindi', 'English', 'Marathi'],
      image: 'doctor6.jpg'
    }
  ];

  const specializations = [
    'all',
    'Panchakarma Specialist',
    'Digestive Health Expert',
    'Women\'s Health Specialist',
    'Joint & Pain Management',
    'Skin & Hair Specialist',
    'Respiratory Health Expert'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      // Try to fetch from Supabase first
      const { data: supabaseDoctors, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('status', 'verified')
        .order('rating', { ascending: false });

      if (error) {
        console.log('No doctors table found, using fallback data');
        setDoctors(fallbackDoctors);
      } else if (supabaseDoctors && supabaseDoctors.length > 0) {
        setDoctors(supabaseDoctors);
      } else {
        // Use fallback data if no doctors in database
        setDoctors(fallbackDoctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors(fallbackDoctors);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <TwoColumnLayout 
      sidebar={<Sidebar type="doctors" />}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Ayurvedic Doctors</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with verified Ayurvedic practitioners for personalized consultations and treatments
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Doctors
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, specialization, or location..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Doctors Grid */}
      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
        {filteredDoctors.map((doctor) => {
            const slug = createSlug(doctor.name);
            
            return (
              <AnimatedCard 
                key={doctor.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                hoverScale={1.03}
                hoverY={-8}
              >
                {/* Doctor Image */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                  <img 
                    src={`/${doctor.image}`} 
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      // Fallback to avatar if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center" style={{display: 'none'}}>
                    <div className="bg-white bg-opacity-90 rounded-full p-4">
                      <div className="text-3xl">👨‍⚕️</div>
                    </div>
                  </div>
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                      doctor.available 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}>
                      {doctor.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link 
                        to={`/doctors/${slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors"
                      >
                        {doctor.name}
                      </Link>
                      <p className="text-green-600 text-sm font-medium">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1">{doctor.rating}</span>
                      <span className="ml-1">({doctor.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🎓</span>
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>₹{doctor.consultation_fee} consultation</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/doctors/${slug}`}
                      className="flex-1"
                    >
                      <AnimatedButton 
                        variant="primary"
                        className="w-full text-center text-sm"
                      >
                        View Profile
                      </AnimatedButton>
                    </Link>
                    <AnimatedButton
                      onClick={() => handleConsultationClick(doctor.name)}
                      variant={doctor.available ? "outline" : "secondary"}
                      className={`flex-1 text-sm ${
                        !doctor.available ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={!doctor.available}
                    >
                      {doctor.available ? 'Consult Now' : 'Unavailable'}
                    </AnimatedButton>
                  </div>
                </div>
              </AnimatedCard>
            );
          })}
      </StaggeredContainer>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
    </TwoColumnLayout>
  );
};

export default BrowseDoctors;

