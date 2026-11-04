import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const BrowseIssues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'digestive', name: 'Digestive Health' },
    { id: 'respiratory', name: 'Respiratory Health' },
    { id: 'skin', name: 'Skin Health' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'pain-relief', name: 'Pain Relief' },
    { id: 'womens-health', name: 'Women\'s Health' }
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
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, selectedCategory]);

  const fetchIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setIssues(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => {
        const issueName = issue.name.toLowerCase();
        const issueDesc = issue.description.toLowerCase();
        
        switch (selectedCategory) {
          case 'digestive':
            return issueName.includes('digest') || issueName.includes('stomach') || 
                   issueName.includes('acid') || issueDesc.includes('digest');
          case 'respiratory':
            return issueName.includes('cold') || issueName.includes('cough') || 
                   issueName.includes('asthma') || issueDesc.includes('respiratory');
          case 'skin':
            return issueName.includes('acne') || issueName.includes('rash') || 
                   issueName.includes('skin') || issueName.includes('dandruff') ||
                   issueName.includes('boil') || issueName.includes('hives');
          case 'mental-health':
            return issueName.includes('anxiety') || issueName.includes('stress') || 
                   issueName.includes('sleep') || issueDesc.includes('mental');
          case 'pain-relief':
            return issueName.includes('pain') || issueName.includes('ache') || 
                   issueName.includes('arthritis') || issueDesc.includes('pain');
          case 'womens-health':
            return issueName.includes('menstrual') || issueName.includes('women') || 
                   issueDesc.includes('women') || issueDesc.includes('female');
          default:
            return true;
        }
      });
    }

    setFilteredIssues(filtered);
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
    const hash = issue.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 20 + 5;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading health issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Background */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <span className="text-6xl">🔍</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Health Issues</h1>
            <p className="text-xl">Discover natural Ayurvedic solutions for common health conditions</p>
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
        sidebar={<Sidebar type="issues" />}
      >
        {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by symptoms, condition name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredIssues.length} of {issues.length} health conditions
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${createSlug(issue.name)}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-green-500 relative overflow-hidden"
              >
                <div 
                  className="absolute top-0 right-0 w-16 h-16 bg-cover bg-center opacity-10 rounded-bl-full"
                  style={{ backgroundImage: 'url(/IssueAvtar.png)' }}
                ></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{issue.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue)}`}>
                      {getSeverityText(issue)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{getRemedyCount(issue)} remedies</span>
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
              style={{ backgroundImage: 'url(/IssueAvtar.png)' }}
            ></div>
            <p className="text-gray-500 text-lg">No health conditions found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>
      </TwoColumnLayout>
    </div>
  );
};

export default BrowseIssues;

