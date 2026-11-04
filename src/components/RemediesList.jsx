import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const RemediesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [remedies, setRemedies] = useState([]);
  const [filteredRemedies, setFilteredRemedies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Remedies');
  const [sortBy, setSortBy] = useState('Sort by Rating');
  const [loading, setLoading] = useState(true);

  // Function to create URL-friendly slug from remedy name
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  // Function to get remedy image based on name
  const getRemedyImage = (remedyName) => {
    const cleanName = remedyName.split(' Description')[0];
    
    // Map remedy names to image filenames
    const imageMap = {
      'Eucalyptus Treatment': 'SectionImgEucalyptus_Treatment.png',
      'Eucalyptus Treatment (Steam Inhalation)': 'SectionImgEucalyptus_Treatment.png',
      'Turmeric Gargle': 'SectionImgTurmeric_Gargle.png',
      'Ginger Baking Soda Bath': 'SectionImgGinger_Baking_Soda_Bath.png',
      'Cumin, Coriander, Fennel Tea (CCF Tea)': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'Cumin Coriander Fennel Tea CCF Tea': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png'
    };

    return imageMap[cleanName] || null;
  };

  const categories = [
    'All Remedies',
    'Digestive',
    'Respiratory',
    'Skin Care',
    'Mental Health',
    'Pain Relief',
    'Immunity'
  ];

  const sortOptions = [
    'Sort by Rating',
    'Sort by Reviews',
    'Sort by Name',
    'Sort by Difficulty'
  ];

  useEffect(() => {
    // Check for search parameter in URL and redirect to comprehensive search
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      navigate(`/search?search=${encodeURIComponent(searchParam)}`);
      return;
    }
    
    fetchRemedies();
  }, [location.search, navigate]);

  const fetchRemedies = async () => {
    try {
      const { data, error } = await supabase
        .from('remedies')
        .select('*');
      
      let remediesData = [];
      
      if (error) {
        console.warn('Database error, using fallback data:', error);
        // Use fallback data if database fails
        remediesData = getFallbackRemedies();
      } else if (data && data.length > 0) {
        // Use database data if available
        remediesData = data;
      } else {
        // Use fallback data if database is empty
        remediesData = getFallbackRemedies();
      }
      
      setRemedies(remediesData);
      setFilteredRemedies(remediesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching remedies:', error);
      // Use fallback data on any error
      const fallbackData = getFallbackRemedies();
      setRemedies(fallbackData);
      setFilteredRemedies(fallbackData);
      setLoading(false);
    }
  };

  // Fallback remedy data
  const getFallbackRemedies = () => {
    return [
      {
        id: 1,
        name: 'Turmeric Golden Milk',
        description: 'A traditional Ayurvedic drink made with turmeric, milk, and warming spices. Known for its anti-inflammatory properties and ability to promote restful sleep and overall wellness.',
        category: 'Digestive'
      },
      {
        id: 2,
        name: 'Ashwagandha for Stress Relief',
        description: 'A powerful adaptogenic herb used in Ayurveda to help the body manage stress, improve energy levels, and support overall mental well-being.',
        category: 'Mental Health'
      },
      {
        id: 3,
        name: 'Ginger Digestive Tea',
        description: 'A warming herbal tea made with fresh ginger root, perfect for improving digestion, reducing nausea, and supporting overall digestive health.',
        category: 'Digestive'
      },
      {
        id: 4,
        name: 'Shatavari, Brahmi, Jatamamsi, Musta (for Insomnia)',
        description: 'A traditional Ayurvedic blend of herbs specifically formulated to promote restful sleep and calm the nervous system.',
        category: 'Mental Health'
      },
      {
        id: 5,
        name: 'Sat Isabgol (Psyllium Husks) with Buttermilk',
        description: 'A gentle digestive remedy that combines the fiber benefits of psyllium with the probiotic properties of buttermilk.',
        category: 'Digestive'
      },
      {
        id: 6,
        name: 'Roasted Cumin Seeds with Aloe Vera Juice',
        description: 'A cooling and digestive remedy that combines the warming properties of cumin with the soothing effects of aloe vera.',
        category: 'Digestive'
      }
    ];
  };

  useEffect(() => {
    filterAndSortRemedies();
  }, [searchTerm, selectedCategory, sortBy, remedies]);

  const filterAndSortRemedies = () => {
    let filtered = [...remedies];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(remedy =>
        remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        remedy.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Remedies') {
      filtered = filtered.filter(remedy => {
        const category = remedy.category || '';
        return category.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    // Sort remedies
    switch (sortBy) {
      case 'Sort by Rating':
        filtered.sort((a, b) => getRemedyRating(b) - getRemedyRating(a));
        break;
      case 'Sort by Reviews':
        filtered.sort((a, b) => getReviewCount(b) - getReviewCount(a));
        break;
      case 'Sort by Name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Sort by Difficulty':
        filtered.sort((a, b) => getDifficultyScore(a) - getDifficultyScore(b));
        break;
      default:
        break;
    }

    setFilteredRemedies(filtered);
  };

  const getRemedyRating = (remedy) => {
    return Math.random() * 2 + 3.5; // Random rating between 3.5-5.5
  };

  const getReviewCount = (remedy) => {
    return Math.floor(Math.random() * 300) + 50; // Random review count 50-350
  };

  const getDifficulty = (remedy) => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const getDifficultyScore = (remedy) => {
    const difficulty = getDifficulty(remedy);
    return difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPreparationTime = (remedy) => {
    return Math.floor(Math.random() * 60) + 5; // Random time 5-65 minutes
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading remedies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <span className="text-6xl">💊</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse All Remedies</h1>
            <p className="text-xl">Discover our complete collection of time-tested Ayurvedic remedies</p>
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700">
          ← Back to Home
        </Link>
      </div>

      <TwoColumnLayout 
        sidebar={<Sidebar type="remedies" />}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search remedies, ingredients, or conditions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Showing {filteredRemedies.length} of {remedies.length} remedies</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRemedies.map((remedy) => {
            const cleanName = remedy.name.split(' Description')[0];
            const slug = remedy.slug || createSlug(cleanName); // Use database slug if available, fallback to generated
            const remedyImage = getRemedyImage(remedy.name);
            
            return (
              <Link
                key={remedy.id}
                to={`/remedies/${slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-48 relative overflow-hidden">
                  {remedyImage ? (
                    <img 
                      src={`/${remedyImage}`} 
                      alt={cleanName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/RemedyAvtar.png)' }}>
                      <div className="bg-green-600 bg-opacity-80 rounded-full p-3">
                        <span className="text-white text-4xl">🌿</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(getDifficulty(remedy))}`}>
                      {getDifficulty(remedy)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {getRemedyRating(remedy).toFixed(1)}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({getReviewCount(remedy)})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {remedy.name.split(' Description')[0]}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Traditional Ayurvedic remedy for natural healing and wellness.
                  </p>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Key ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Herbs
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +1 more
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{getPreparationTime(remedy)} minutes</span>
                    <span className="text-green-600">View Recipe →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredRemedies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No remedies found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </TwoColumnLayout>
    </div>
  );
};

export default RemediesList;

