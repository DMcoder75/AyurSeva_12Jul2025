import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Search, Pill, Leaf, AlertCircle, Clock, Star } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    remedies: [],
    herbs: [],
    issues: []
  });
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      performSearch(searchParam);
    }
  }, [location.search]);

  // Helper function to generate slug from name (matches HerbDetail's createSlug)
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const performSearch = async (term) => {
    setLoading(true);
    console.log('Performing search for term:', term);
    
    try {
      // Search in remedies table with multiple fields
      console.log('Searching remedies...');
      const { data: remediesData, error: remediesError } = await supabase
        .from('remedies')
        .select('*')
        .or(`name.ilike.%${term}%, description.ilike.%${term}%, description_long.ilike.%${term}%, benefits.ilike.%${term}%`);
      
      if (remediesError) {
        console.error('Remedies search error:', remediesError);
      } else {
        console.log('Remedies found:', remediesData?.length || 0, remediesData);
      }

      // Search in herbs table with multiple fields
      console.log('Searching herbs...');
      const { data: herbsData, error: herbsError } = await supabase
        .from('herbs')
        .select('*')
        .or(`name.ilike.%${term}%, botanical_name.ilike.%${term}%, properties.ilike.%${term}%`);
      
      if (herbsError) {
        console.error('Herbs search error:', herbsError);
      } else {
        console.log('Herbs found:', herbsData?.length || 0, herbsData);
        if (herbsData && herbsData.length > 0) {
          console.log('First herb structure:', Object.keys(herbsData[0]));
          console.log('First herb data:', herbsData[0]);
          console.log('First herb slug:', herbsData[0].slug);
        }
      }

      // Search in issues table - using name field for now
      console.log('Searching issues...');
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select('*')
        .ilike('name', `%${term}%`);
      
      if (issuesError) {
        console.error('Issues search error:', issuesError);
      } else {
        console.log('Issues found:', issuesData?.length || 0, issuesData);
      }

      const searchResults = {
        remedies: remediesData || [],
        herbs: herbsData || [],
        issues: issuesData || []
      };

      console.log('Final search results:', searchResults);
      setResults(searchResults);
      setTotalResults(
        (remediesData?.length || 0) + 
        (herbsData?.length || 0) + 
        (issuesData?.length || 0)
      );
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const newUrl = `/search?search=${encodeURIComponent(searchTerm.trim())}`;
      window.history.pushState({}, '', newUrl);
      performSearch(searchTerm.trim());
    }
  };

  const getRemedyImage = (remedyName) => {
    const imageMap = {
      'Eucalyptus Treatment': 'SectionImgEucalyptus_Treatment.png',
      'Turmeric Gargle': 'SectionImgTurmeric_Gargle.png',
      'Ginger Baking Soda Bath': 'SectionImgGinger_Baking_Soda_Bath.png',
      'Cumin, Coriander, Fennel Tea (CCF Tea)': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png'
    };
    return imageMap[remedyName] || 'FeatureRemedyAvtar.png';
  };

  const getHerbImage = (herbName) => {
    return 'HerbAvtar.png';
  };

  const getIssueImage = (issueName) => {
    return 'IssueAvtar.png';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="mt-1 text-gray-600">
                {totalResults} results found for "{searchTerm}"
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 md:mt-0 md:ml-6">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for symptoms, conditions, remedies, herbs..."
                    className="pl-12 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="ml-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalResults === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or browse our categories.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link to="/browse-remedies" className="text-green-600 hover:text-green-700">
                Browse Remedies
              </Link>
              <Link to="/browse-herbs" className="text-green-600 hover:text-green-700">
                Browse Herbs
              </Link>
              <Link to="/browse-issues" className="text-green-600 hover:text-green-700">
                Browse Issues
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Remedies Section */}
            {results.remedies.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <Pill className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Remedies ({results.remedies.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.remedies.map((remedy) => (
                    <Link
                      key={remedy.id}
                      to={`/remedies/${remedy.slug}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={`/${getRemedyImage(remedy.name)}`}
                          alt={remedy.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = '/FeatureRemedyAvtar.png';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {remedy.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {remedy.overview}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Traditional Remedy
                          </span>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {remedy.preparation_time || '15 min'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Herbs Section */}
            {results.herbs.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <Leaf className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Herbs ({results.herbs.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.herbs.map((herb) => (
                    <Link
                      key={herb.id}
                      to={`/herbs/${generateSlug(herb.name)}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={`/${getHerbImage(herb.name)}`}
                          alt={herb.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = '/HerbAvtar.png';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {herb.name}
                        </h3>
                        {herb.botanical_name && (
                          <p className="text-sm text-gray-500 italic mb-2">
                            {herb.botanical_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {herb.overview}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Medicinal Herb
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Issues Section */}
            {results.issues.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Health Issues ({results.issues.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.issues.map((issue) => (
                    <Link
                      key={issue.id}
                      to={`/issues/${issue.slug}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={`/${getIssueImage(issue.name)}`}
                          alt={issue.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = '/IssueAvtar.png';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {issue.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {issue.overview}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Health Issue
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

