import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const IssueDetail = () => {
  const { slug } = useParams();
  const [issue, setIssue] = useState(null);
  const [linkedRemedies, setLinkedRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Function to create remedy slug
  const createRemedySlug = (name) => {
    // Clean the name first (remove "Description and purpose:" part)
    const cleanName = name.split(' Description')[0];
    return cleanName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Mapping of issue remedy names to actual remedy names in database
  const remedyNameMapping = {
    'Cumin-Coriander-Fennel Tea': 'Cumin, Coriander, Fennel Tea (CCF Tea)',
    'Cumin, Coriander, Fennel Tea': 'Cumin, Coriander, Fennel Tea (CCF Tea)',
    'CCF Tea': 'Cumin, Coriander, Fennel Tea (CCF Tea)',
    'Turmeric Gargle': 'Turmeric Gargle',
    'Ginger Baking Soda Bath': 'Ginger Baking Soda Bath',
    'Eucalyptus Treatment': 'Eucalyptus Treatment (Steam Inhalation)',
    'Steam Inhalation': 'Eucalyptus Treatment (Steam Inhalation)'
  };

  useEffect(() => {
    fetchIssueAndRemedies();
  }, [slug]);

  const fetchIssueAndRemedies = async () => {
    try {
      setLoading(true);
      
      // First try to find issue by slug
      let { data: issueData, error: issueError } = await supabase
        .from('issues')
        .select('*')
        .eq('slug', slug)
        .single();

      // If not found by slug, try to find by name matching
      if (issueError || !issueData) {
        const { data: allIssues, error: allError } = await supabase
          .from('issues')
          .select('*');

        if (allError) {
          // If database fails, use fallback data
          const fallbackIssue = getFallbackIssue(slug);
          if (fallbackIssue) {
            setIssue(fallbackIssue);
            await fetchLinkedRemedies(fallbackIssue.name);
            setError(null);
            setLoading(false);
            return;
          }
          throw allError;
        }

        // Find issue by matching slug with created slug from name
        const foundIssue = allIssues.find(i => createSlug(i.name) === slug);
        
        if (foundIssue) {
          issueData = foundIssue;
          issueError = null;
        } else {
          // If not found in database, try fallback data
          const fallbackIssue = getFallbackIssue(slug);
          if (fallbackIssue) {
            setIssue(fallbackIssue);
            await fetchLinkedRemedies(fallbackIssue.name);
            setError(null);
            setLoading(false);
            return;
          }
          throw new Error('Issue not found');
        }
      }

      setIssue(issueData);

      // Now fetch linked remedies based on the issue name
      await fetchLinkedRemedies(issueData.name);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching issue:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fallback issue data for common health issues
  const getFallbackIssue = (slug) => {
    const fallbackIssues = {
      'arthritis': {
        id: 'arthritis',
        name: 'Arthritis',
        description: 'Arthritis occurs when toxins (ama) accumulate in the colon, are absorbed into the bloodstream, and lodge in the bone tissue (asthi dhatu) and joints, causing stiffness and pain.',
        symptoms: 'Joint pain, stiffness, swelling, reduced range of motion',
        causes: 'Accumulation of toxins (ama), poor digestion, sedentary lifestyle',
        ayurvedic_perspective: 'Primarily a Vata disorder with involvement of ama (toxins)',
        severity: 'Mild to Severe',
        category: 'digestive'
      },
      'bad-breath': {
        id: 'bad-breath',
        name: 'Bad Breath',
        description: 'Bad breath often indicates slow digestion, low gastric fire (agni), and an increase of toxins (ama) in the colon.',
        symptoms: 'Unpleasant mouth odor, metallic taste, dry mouth',
        causes: 'Poor oral hygiene, digestive issues, toxin accumulation',
        ayurvedic_perspective: 'Related to weak digestive fire and ama accumulation',
        severity: 'Mild',
        category: 'digestive'
      },
      'bloating': {
        id: 'bloating',
        name: 'Bloating',
        description: 'An uncomfortable feeling caused by impaired digestion due to imbalanced Pitta. Can be caused by gases in the stomach.',
        symptoms: 'Abdominal distension, gas, discomfort after eating',
        causes: 'Impaired digestion, eating incompatible foods, stress',
        ayurvedic_perspective: 'Primarily a Pitta and Vata imbalance',
        severity: 'Mild',
        category: 'digestive'
      },
      'asthma': {
        id: 'asthma',
        name: 'Asthma',
        description: 'Asthma causes wheezing, and may be due to constriction of the bronchial tree by Vata dosha.',
        symptoms: 'Wheezing, shortness of breath, chest tightness, coughing',
        causes: 'Vata imbalance, allergens, stress, cold weather',
        ayurvedic_perspective: 'Primarily a Vata disorder affecting the respiratory system',
        severity: 'Mild to Severe',
        category: 'respiratory'
      },
      'colds': {
        id: 'colds',
        name: 'Colds',
        description: 'Colds are common ailments caused by viral infections, often occurring when immunity is low.',
        symptoms: 'Runny nose, sneezing, cough, mild fever, fatigue',
        causes: 'Viral infection, low immunity, seasonal changes',
        ayurvedic_perspective: 'Kapha imbalance with involvement of Vata',
        severity: 'Mild',
        category: 'respiratory'
      },
      'cough': {
        id: 'cough',
        name: 'Cough',
        description: 'Cough is a natural reflex to clear the respiratory tract, often indicating Kapha imbalance.',
        symptoms: 'Persistent coughing, throat irritation, mucus production',
        causes: 'Respiratory infections, allergies, environmental irritants',
        ayurvedic_perspective: 'Primarily Kapha disorder with possible Vata involvement',
        severity: 'Mild',
        category: 'respiratory'
      }
    };

    return fallbackIssues[slug] || null;
  };

  const fetchLinkedRemedies = async (issueName) => {
    try {
      // Load the issues JSON to get linked remedies
      const issuesResponse = await fetch('/Ayurvedic_Issues_Formatted.json');
      if (!issuesResponse.ok) {
        console.warn('Could not load issues JSON file');
        return;
      }
      
      const issuesData = await issuesResponse.json();
      const issueData = issuesData.find(i => i['Issue Name'] === issueName);
      
      if (!issueData || !issueData['List of linked remedies (references to Remedy documents)']) {
        console.warn('No linked remedies found for issue:', issueName);
        return;
      }

      const linkedRemedyNames = issueData['List of linked remedies (references to Remedy documents)'];
      
      // Fetch all remedies from database
      const { data: allRemedies, error: remediesError } = await supabase
        .from('remedies')
        .select('*');

      if (remediesError) {
        console.error('Error fetching remedies:', remediesError);
        return;
      }

      // Match linked remedy names with actual remedies in database
      const matchedRemedies = [];
      
      for (const linkedRemedyName of linkedRemedyNames) {
        // Skip the "Related herbs" entry
        if (linkedRemedyName.includes('Related herbs')) continue;
        
        // Try direct mapping first
        const mappedName = remedyNameMapping[linkedRemedyName] || linkedRemedyName;
        
        // Find matching remedy in database
        const matchedRemedy = allRemedies.find(remedy => {
          const remedyName = remedy.name || '';
          return remedyName.includes(mappedName) || 
                 remedyName.includes(linkedRemedyName) ||
                 mappedName.includes(remedyName.split(' Description')[0]);
        });

        if (matchedRemedy) {
          matchedRemedies.push({
            ...matchedRemedy,
            originalName: linkedRemedyName
          });
        } else {
          // Create a placeholder for missing remedies
          matchedRemedies.push({
            id: `placeholder-${linkedRemedyName.replace(/\s+/g, '-')}`,
            name: linkedRemedyName,
            originalName: linkedRemedyName,
            description: `Traditional Ayurvedic remedy for ${issueName.toLowerCase()}`,
            isPlaceholder: true
          });
        }
      }

      setLinkedRemedies(matchedRemedies);
    } catch (err) {
      console.error('Error fetching linked remedies:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading issue information...</p>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
          <p className="text-gray-600 mb-4">The health issue you're looking for doesn't exist.</p>
          <Link to="/browse-issues" className="text-green-600 hover:text-green-700">
            ← Back to Browse Issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/DetailAvtar.png)`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{issue.name}</h1>
            <p className="text-xl">Natural Ayurvedic Solutions</p>
            <div className="flex items-center justify-center mt-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Health Issue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link to="/browse-issues" className="hover:text-green-600">Issues</Link>
          <span>/</span>
          <span className="text-gray-900">{issue.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {issue.description || `${issue.name} is a common health concern that can be effectively addressed through traditional Ayurvedic approaches. This condition affects many people and can be managed naturally through proper diet, lifestyle modifications, and herbal remedies.`}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Common Symptoms</h3>
                  <p className="text-gray-700">{issue.symptoms || 'Various symptoms may be associated with this condition'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ayurvedic Perspective</h3>
                  <p className="text-gray-700">Traditional Ayurvedic understanding and approach to treatment</p>
                </div>
              </div>
            </div>

            {/* Ayurvedic Understanding */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ayurvedic Understanding</h2>
              <p className="text-gray-700 leading-relaxed">
                According to Ayurveda, {issue.name.toLowerCase()} is often related to imbalances in the doshas (Vata, Pitta, and Kapha). 
                Understanding the root cause helps in selecting the most appropriate natural remedies and lifestyle modifications 
                for effective treatment and prevention.
              </p>
            </div>

            {/* Recommended Remedies */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Remedies for {issue.name}</h2>
              {linkedRemedies.length > 0 ? (
                <div className="space-y-4">
                  {linkedRemedies.map((remedy, index) => (
                    <div key={remedy.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {remedy.isPlaceholder ? (
                        <div className="opacity-75">
                          <h3 className="font-semibold text-gray-900 mb-2">{remedy.originalName}</h3>
                          <p className="text-gray-600 mb-2">{remedy.description}</p>
                          <span className="text-sm text-gray-500 italic">Traditional Ayurvedic remedy</span>
                        </div>
                      ) : (
                        <Link to={`/remedy/${createRemedySlug(remedy.name)}`} className="block">
                          <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600">
                            {remedy.name.split(' Description')[0]}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {remedy.description || `Traditional Ayurvedic remedy specifically beneficial for ${issue.name.toLowerCase()}`}
                          </p>
                          <span className="text-green-600 text-sm font-medium">Learn More →</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Explore our collection of time-tested Ayurvedic remedies that may be beneficial for {issue.name.toLowerCase()}.
                  </p>
                  <Link 
                    to="/remedies" 
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Browse All Remedies
                  </Link>
                </div>
              )}
            </div>

            {/* Lifestyle Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lifestyle Recommendations</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dietary Guidelines</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Follow a balanced, wholesome diet</li>
                    <li>Eat fresh, seasonal foods</li>
                    <li>Maintain regular meal times</li>
                    <li>Stay adequately hydrated</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Daily Practices</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Practice regular exercise or yoga</li>
                    <li>Maintain consistent sleep schedule</li>
                    <li>Manage stress through meditation</li>
                    <li>Follow proper hygiene practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 block text-sm">Condition</span>
                  <span className="font-medium">{issue.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 block text-sm">Category</span>
                  <span className="font-medium">{issue.category || 'Health Issue'}</span>
                </div>
                <div>
                  <span className="text-gray-600 block text-sm">Available Remedies</span>
                  <span className="font-medium">{linkedRemedies.length} specific remedies</span>
                </div>
                <div>
                  <span className="text-gray-600 block text-sm">Treatment Approach</span>
                  <span className="font-medium">Natural & Ayurvedic</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link 
                  to="/remedies" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Browse All Remedies
                </Link>
                <Link 
                  to="/browse-issues" 
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Browse More Issues
                </Link>
              </div>
            </div>

            {/* Related Issues */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Issues</h3>
              <div className="space-y-3">
                <Link to="/issue/digestive-problems" className="block p-3 hover:bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Digestive Problems</h4>
                  <p className="text-sm text-gray-600">Natural digestive support</p>
                </Link>
                <Link to="/issue/stress-anxiety" className="block p-3 hover:bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Stress & Anxiety</h4>
                  <p className="text-sm text-gray-600">Mental wellness solutions</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;

