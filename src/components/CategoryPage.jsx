import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const CategoryPage = () => {
  const { category } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = {
    digestive: {
      title: 'Digestive Health',
      description: 'Natural remedies for digestive issues and gut health',
      icon: '🌿',
      color: 'bg-green-600',
      bgImage: '/category-herbs.jpg'
    },
    respiratory: {
      title: 'Respiratory Health',
      description: 'Ayurvedic solutions for breathing and lung health',
      icon: '💨',
      color: 'bg-blue-600',
      bgImage: '/herbs-spices.jpg'
    },
    skin: {
      title: 'Skin Health',
      description: 'Natural treatments for skin conditions and beauty',
      icon: '✨',
      color: 'bg-yellow-600',
      bgImage: '/traditional-preparation.jpg'
    },
    'mental-health': {
      title: 'Mental Health',
      description: 'Holistic approaches to mental wellness and balance',
      icon: '🧠',
      color: 'bg-purple-600',
      bgImage: '/yoga-meditation.jpg'
    },
    'pain-relief': {
      title: 'Pain Relief',
      description: 'Natural pain management and healing solutions',
      icon: '⚡',
      color: 'bg-orange-600',
      bgImage: '/category-herbs.jpg'
    },
    'womens-health': {
      title: 'Women\'s Health',
      description: 'Specialized care for women\'s wellness needs',
      icon: '🌸',
      color: 'bg-pink-600',
      bgImage: '/herbs-spices.jpg'
    }
  };

  const currentCategory = categoryInfo[category] || {
    title: 'Health Category',
    description: 'Explore health issues in this category',
    icon: '🌿',
    color: 'bg-green-600',
    bgImage: '/category-herbs.jpg'
  };

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
    fetchCategoryIssues();
  }, [category]);

  const fetchCategoryIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*');
      
      if (error) throw error;
      
      // Improved filtering logic for each category
      const filteredIssues = data.filter(issue => {
        const issueName = issue.name.toLowerCase();
        const issueDesc = issue.description.toLowerCase();
        
        let matches = false;
        
        if (category === 'digestive') {
          matches = issueName.includes('digest') || 
                   issueName.includes('stomach') || 
                   issueName.includes('acid') ||
                   issueName.includes('bloat') ||
                   issueName.includes('constipat') ||
                   issueName.includes('diarrhea') ||
                   issueName.includes('nausea') ||
                   issueName.includes('indigestion') ||
                   issueDesc.includes('digest') ||
                   issueDesc.includes('stomach') ||
                   issueDesc.includes('colon') ||
                   issueDesc.includes('gastric');
        } else if (category === 'respiratory') {
          matches = issueName.includes('cold') || 
                   issueName.includes('cough') || 
                   issueName.includes('asthma') ||
                   issueName.includes('bronch') ||
                   issueName.includes('sinus') ||
                   issueName.includes('breath') ||
                   issueDesc.includes('respiratory') ||
                   issueDesc.includes('breathing') ||
                   issueDesc.includes('lung') ||
                   issueDesc.includes('bronch');
        } else if (category === 'skin') {
          matches = issueName.includes('acne') || 
                   issueName.includes('rash') || 
                   issueName.includes('eczema') ||
                   issueName.includes('skin') ||
                   issueName.includes('dry skin') ||
                   issueName.includes('boil') ||
                   issueName.includes('dandruff') ||
                   issueName.includes('hives') ||
                   issueName.includes('bite') ||
                   issueName.includes('sting') ||
                   issueDesc.includes('skin') ||
                   issueDesc.includes('scalp') ||
                   issueDesc.includes('rash') ||
                   issueDesc.includes('pimple');
        } else if (category === 'mental-health') {
          matches = issueName.includes('anxiety') || 
                   issueName.includes('stress') || 
                   issueName.includes('depression') ||
                   issueName.includes('mental') ||
                   issueName.includes('mood') ||
                   issueName.includes('sleep') ||
                   issueName.includes('insomnia') ||
                   issueDesc.includes('mental') ||
                   issueDesc.includes('stress') ||
                   issueDesc.includes('anxiety') ||
                   issueDesc.includes('mood') ||
                   issueDesc.includes('emotional');
        } else if (category === 'pain-relief') {
          matches = issueName.includes('pain') || 
                   issueName.includes('ache') || 
                   issueName.includes('arthritis') ||
                   issueName.includes('backache') ||
                   issueName.includes('headache') ||
                   issueName.includes('migraine') ||
                   issueName.includes('joint') ||
                   issueDesc.includes('pain') ||
                   issueDesc.includes('ache') ||
                   issueDesc.includes('joint') ||
                   issueDesc.includes('muscle');
        } else if (category === 'womens-health') {
          matches = issueName.includes('menstrual') || 
                   issueName.includes('women') || 
                   issueName.includes('pregnancy') ||
                   issueName.includes('female') ||
                   issueName.includes('period') ||
                   issueDesc.includes('women') ||
                   issueDesc.includes('menstrual') ||
                   issueDesc.includes('female') ||
                   issueDesc.includes('pregnancy');
        }
        
        return matches;
      });
      
      setIssues(filteredIssues);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category issues:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (issue) => {
    const name = issue.name.toLowerCase();
    if (name.includes('severe') || name.includes('chronic')) return 'bg-red-100 text-red-700';
    if (name.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getSeverityText = (issue) => {
    const name = issue.name.toLowerCase();
    if (name.includes('severe') || name.includes('chronic')) return 'Severe';
    if (name.includes('moderate')) return 'Moderate';
    return 'Mild';
  };

  const getRemedyCount = (issue) => {
    // Generate remedy count based on issue name hash
    const hash = issue.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 20 + 5; // Between 5-25 remedies
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading category information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Background Image */}
      <div className={`relative ${currentCategory.color} text-white py-16 overflow-hidden`}>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${currentCategory.bgImage})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-gray-200 mb-6">
            ← Back to Home
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h1 className="text-4xl font-bold mb-4">{currentCategory.title}</h1>
            <p className="text-xl text-white/90">{currentCategory.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common {currentCategory.title} Issues</h2>
          <p className="text-gray-600">Explore specific conditions in this category and discover natural remedies</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">{issues.length} conditions found</p>
        </div>

        {issues.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${createSlug(issue.name)}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-current overflow-hidden"
                style={{ borderLeftColor: currentCategory.color.replace('bg-', '').replace('-600', '') }}
              >
                <div 
                  className="absolute top-0 right-0 w-20 h-20 bg-cover bg-center opacity-10 rounded-bl-full"
                  style={{ backgroundImage: `url(${currentCategory.bgImage})` }}
                ></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{issue.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue)}`}>
                      {getSeverityText(issue)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{getRemedyCount(issue)} remedies available</span>
                    <span className="text-green-600 font-medium">Learn More →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div 
              className="w-32 h-32 mx-auto mb-6 bg-cover bg-center rounded-full opacity-20"
              style={{ backgroundImage: `url(${currentCategory.bgImage})` }}
            ></div>
            <p className="text-gray-500 text-lg">No specific conditions found for this category.</p>
            <p className="text-gray-400 mt-2">Check back later as we continue to expand our database.</p>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Related Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== category)
              .map(([key, info]) => (
                <Link
                  key={key}
                  to={`/category/${key}`}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow overflow-hidden relative"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-5"
                    style={{ backgroundImage: `url(${info.bgImage})` }}
                  ></div>
                  <div className="relative">
                    <div className="text-2xl mb-2">{info.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm">{info.title}</h4>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

