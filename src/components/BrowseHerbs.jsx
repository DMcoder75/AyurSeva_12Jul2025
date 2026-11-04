import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const BrowseHerbs = () => {
  const [herbs, setHerbs] = useState([]);
  const [filteredHerbs, setFilteredHerbs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Herbs');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All Herbs',
    'Adaptogens',
    'Digestive',
    'Anti-inflammatory',
    'Immune Support',
    'Calming',
    'Detoxifying'
  ];

  // Function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  useEffect(() => {
    fetchHerbs();
  }, []);

  const fetchHerbs = async () => {
    try {
      const { data, error } = await supabase
        .from('herbs')
        .select('*');
      
      if (error) throw error;
      
      setHerbs(data);
      setFilteredHerbs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching herbs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = herbs;

    if (searchTerm) {
      filtered = filtered.filter(herb =>
        herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (herb.botanical_name && herb.botanical_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (herb.properties && herb.properties.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'All Herbs') {
      filtered = filtered.filter(herb =>
        (herb.properties && herb.properties.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        herb.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredHerbs(filtered);
  }, [searchTerm, selectedCategory, herbs]);

  const getHerbRating = (herb) => {
    // Generate a rating based on herb name hash for consistency
    const hash = herb.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (Math.abs(hash) % 10) / 10 * 1.5 + 4.0; // Rating between 4.0 and 5.5
  };

  const getUseTags = (herb) => {
    if (!herb.properties) return [];
    
    const properties = herb.properties.toLowerCase();
    const tags = [];
    
    if (properties.includes('inflammation') || properties.includes('anti-inflammatory')) tags.push('Inflammation');
    if (properties.includes('digest') || properties.includes('stomach')) tags.push('Digestion');
    if (properties.includes('stress') || properties.includes('anxiety') || properties.includes('calm')) tags.push('Stress');
    if (properties.includes('energy') || properties.includes('strength')) tags.push('Energy');
    if (properties.includes('sleep') || properties.includes('relax')) tags.push('Sleep');
    if (properties.includes('circulation') || properties.includes('heart')) tags.push('Circulation');
    
    return tags.slice(0, 3); // Limit to 3 tags
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading Ayurvedic herbs...</p>
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
              <span className="text-6xl">🌿</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Ayurvedic Herbs</h1>
            <p className="text-xl">Discover the healing power of traditional Ayurvedic herbs and their therapeutic properties</p>
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
        sidebar={<Sidebar type="herbs" />}
      >
        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search herbs by name, botanical name, or properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-48"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg">Showing {filteredHerbs.length} of {herbs.length} herbs</p>
        </div>

        {/* Herbs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHerbs.map((herb) => (
            <Link
              key={herb.id}
              to={`/herbs/${createSlug(herb.name)}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cover bg-center rounded-full flex items-center justify-center" style={{ backgroundImage: 'url(/HerbAvtar.png)' }}>
                    <div className="bg-green-600 bg-opacity-80 rounded-full w-full h-full flex items-center justify-center">
                      <span className="text-white text-xl">🌿</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {getHerbRating(herb).toFixed(1)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{herb.name}</h3>
                <p className="text-sm text-gray-500 italic mb-3">
                  {herb.botanical_name && herb.botanical_name !== 'Not specified in sources.' 
                    ? herb.botanical_name 
                    : 'Traditional Ayurvedic herb'}
                </p>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {herb.properties && herb.properties !== 'Not specified in sources.' 
                    ? (herb.properties.length > 100 
                        ? herb.properties.substring(0, 100) + '...'
                        : herb.properties)
                    : `${herb.name} is a traditional Ayurvedic herb known for its therapeutic properties and healing benefits.`
                  }
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Primary Uses:</p>
                  <div className="flex flex-wrap gap-1">
                    {getUseTags(herb).length > 0 ? (
                      getUseTags(herb).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Traditional Use
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Learn more</span>
                  <span className="text-green-600">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredHerbs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">No herbs found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </TwoColumnLayout>
    </div>
  );
};

export default BrowseHerbs;

