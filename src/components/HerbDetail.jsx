import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const HerbDetail = () => {
  const { slug } = useParams();
  const [herb, setHerb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the slug is actually an ingredient_id (starts with ING_)
  const isIngredientId = /^ING_/.test(slug);

  // Function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  // Function to get herb image
  const getHerbImage = (herbName) => {
    const imageMap = {
      'turmeric': '/SectionImgTurmeric_Gargle.png',
      'ginger': '/SectionImgGinger_Baking_Soda_Bath.png',
      'eucalyptus': '/SectionImgEucalyptus_Treatment.png',
      'cumin': '/SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'coriander': '/SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'fennel': '/SectionImgCumin_Coriander_FennelTea_CCF_Tea.png'
    };

    const herbKey = herbName.toLowerCase().replace(/[^a-z]/g, '');
    return imageMap[herbKey] || null;
  };

  // Fallback herb data for common herbs
  const getFallbackHerb = (slug) => {
    const fallbackHerbs = {
      'ashwagandha': {
        id: 'ashwagandha',
        name: 'Ashwagandha',
        botanical_name: 'Withania somnifera',
        description: 'A powerful adaptogenic herb used in Ayurveda to help the body manage stress, improve energy levels, and support overall mental well-being.',
        properties: ['Adaptogenic', 'Stress Relief', 'Energy'],
        uses: ['Stress management', 'Energy enhancement', 'Sleep support'],
        category: 'Adaptogen'
      },
      'turmeric': {
        id: 'turmeric',
        name: 'Turmeric',
        botanical_name: 'Curcuma longa',
        description: 'A golden spice with powerful anti-inflammatory and antioxidant properties, widely used in Ayurvedic medicine.',
        properties: ['Anti-inflammatory', 'Antioxidant', 'Digestive'],
        uses: ['Inflammation reduction', 'Digestive support', 'Immune support'],
        category: 'Anti-inflammatory'
      },
      'ginger': {
        id: 'ginger',
        name: 'Ginger',
        botanical_name: 'Zingiber officinale',
        description: 'A warming herb excellent for digestion, nausea relief, and circulation support.',
        properties: ['Digestive', 'Warming', 'Anti-nausea'],
        uses: ['Digestive support', 'Nausea relief', 'Circulation'],
        category: 'Digestive'
      },
      'aloe-vera': {
        id: 'aloe-vera',
        name: 'Aloe Vera',
        botanical_name: 'Aloe barbadensis',
        description: 'A cooling and soothing herb known for its healing properties for skin and digestive issues.',
        properties: ['Cooling', 'Healing', 'Soothing'],
        uses: ['Skin healing', 'Digestive support', 'Burns and wounds'],
        category: 'Healing'
      },
      'brahmi': {
        id: 'brahmi',
        name: 'Brahmi',
        botanical_name: 'Bacopa monnieri',
        description: 'A renowned brain tonic in Ayurveda, used to enhance memory, concentration, and cognitive function.',
        properties: ['Nootropic', 'Memory enhancing', 'Calming'],
        uses: ['Memory support', 'Concentration', 'Mental clarity'],
        category: 'Brain tonic'
      },
      'ajwain-seed': {
        id: 'ajwain-seed',
        name: 'Ajwain Seed',
        botanical_name: 'Trachyspermum ammi',
        description: 'A digestive spice with carminative properties, excellent for digestive issues and respiratory support.',
        properties: ['Digestive', 'Carminative', 'Respiratory'],
        uses: ['Digestive support', 'Gas relief', 'Respiratory health'],
        category: 'Digestive'
      }
    };

    return fallbackHerbs[slug] || null;
  };

  useEffect(() => {
    fetchHerb();
  }, [slug]);

  const fetchHerb = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data = null;
      let error = null;

      if (isIngredientId) {
        // If it's an ingredient_id, fetch from ingredients table
        const { data: ingredientData, error: ingredientError } = await supabase
          .from('ingredients')
          .select('*')
          .eq('ingredient_id', slug) // Use slug directly as string, not parseInt
          .single();

        if (ingredientError || !ingredientData) {
          console.warn('Ingredient not found in database:', ingredientError);
          error = ingredientError;
        } else {
          data = ingredientData;
        }
      } else {
        // Original slug-based logic for herbs table
        // First try to find by slug in database
        const { data: herbData, error: herbError } = await supabase
          .from('herbs')
          .select('*')
          .eq('slug', slug)
          .single();

        // If not found by slug, try to find by name matching
        if (herbError || !herbData) {
          const { data: allHerbs, error: allError } = await supabase
            .from('herbs')
            .select('*');

          if (!allError && allHerbs && allHerbs.length > 0) {
            // Find herb by matching slug with created slug from name
            const foundHerb = allHerbs.find(h => createSlug(h.name) === slug);
            
            if (foundHerb) {
              data = foundHerb;
              error = null;
            } else {
              error = herbError;
            }
          } else {
            error = herbError;
          }
        } else {
          data = herbData;
        }
      }

      // If still not found in database, try fallback data (only for slug-based requests)
      if ((error || !data) && !isIngredientId) {
        console.warn('Database error or herb not found, using fallback data:', error);
        const fallbackHerb = getFallbackHerb(slug);
        if (fallbackHerb) {
          setHerb(fallbackHerb);
          setError(null);
        } else {
          setError('Herb not found');
        }
      } else if (error || !data) {
        setError(isIngredientId ? 'Ingredient not found' : 'Herb not found');
      } else {
        setHerb(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching herb/ingredient:', err);
      
      // Try fallback data on any error (only for slug-based requests)
      if (!isIngredientId) {
        const fallbackHerb = getFallbackHerb(slug);
        if (fallbackHerb) {
          setHerb(fallbackHerb);
          setError(null);
        } else {
          setError('Failed to load herb');
        }
      } else {
        setError('Failed to load ingredient');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading herb information...</p>
        </div>
      </div>
    );
  }

  if (error || !herb) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isIngredientId ? 'Ingredient Not Found' : 'Herb Not Found'}
          </h1>
          <p className="text-gray-600 mb-4">
            The {isIngredientId ? 'ingredient' : 'herb'} you're looking for doesn't exist.
          </p>
          <Link to="/browse-herbs" className="text-green-600 hover:text-green-700">
            ← Back to Browse Herbs
          </Link>
        </div>
      </div>
    );
  }

  const herbImage = getHerbImage(herb.name);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: herbImage 
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${herbImage})`
            : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/DetailAvtar.png)`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{herb.name}</h1>
            <p className="text-xl italic">
              {herb.botanical_name && herb.botanical_name !== 'Not specified in sources.' 
                ? herb.botanical_name 
                : isIngredientId 
                  ? 'Traditional Ayurvedic Ingredient' 
                  : 'Traditional Ayurvedic Herb'}
            </p>
            <div className="flex items-center justify-center mt-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                {isIngredientId ? 'Traditional Ingredient' : 'Traditional Herb'}
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
          <Link to="/browse-herbs" className="hover:text-green-600">
            {isIngredientId ? 'Ingredients' : 'Herbs'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{herb.name}</span>
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
                {herb.properties && herb.properties !== 'Not specified in sources.' 
                  ? herb.properties 
                  : `${herb.name} is a traditional Ayurvedic herb known for its therapeutic properties and healing benefits. This herb has been used for centuries in traditional medicine systems for promoting natural health and wellness.`}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Botanical Name</h3>
                  <p className="text-gray-700 italic">
                    {herb.botanical_name && herb.botanical_name !== 'Not specified in sources.' 
                      ? herb.botanical_name 
                      : 'Traditional Ayurvedic herb'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Common Names</h3>
                  <p className="text-gray-700">{herb.name}</p>
                </div>
              </div>
            </div>

            {/* Properties */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ayurvedic Properties</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Primary Properties</h3>
                  <p className="text-gray-700">
                    {herb.properties && herb.properties !== 'Not specified in sources.' 
                      ? herb.properties 
                      : 'Traditional Ayurvedic herb with therapeutic properties used for natural healing and wellness.'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Traditional Uses</h3>
                  <p className="text-gray-700">Used in traditional Ayurvedic medicine for various therapeutic purposes</p>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Guidelines</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preparation Methods</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fresh herb preparation</li>
                    <li>Dried powder form</li>
                    <li>Herbal decoctions</li>
                    <li>Traditional formulations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Precautions</h3>
                  <p className="text-gray-700">
                    Consult with a qualified Ayurvedic practitioner before use. 
                    Pregnant and nursing women should seek professional advice.
                  </p>
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
                  <span className="text-gray-600 block text-sm">Botanical Name</span>
                  <span className="font-medium italic">
                    {herb.botanical_name && herb.botanical_name !== 'Not specified in sources.' 
                      ? herb.botanical_name 
                      : 'Traditional Ayurvedic herb'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block text-sm">Category</span>
                  <span className="font-medium">Traditional Herb</span>
                </div>
                <div>
                  <span className="text-gray-600 block text-sm">Origin</span>
                  <span className="font-medium">Ayurvedic Medicine</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Link 
                  to="/remedies" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Find Remedies
                </Link>
                <Link 
                  to="/browse-herbs" 
                  className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors"
                >
                  Browse More Herbs
                </Link>
              </div>
            </div>

            {/* Related Remedies */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Remedies</h3>
              <div className="space-y-3">
                <Link to="/remedy/turmeric-golden-milk" className="block p-3 hover:bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Turmeric Golden Milk</h4>
                  <p className="text-sm text-gray-600">Anti-inflammatory drink</p>
                </Link>
                <Link to="/remedy/ginger-tea" className="block p-3 hover:bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Ginger Tea</h4>
                  <p className="text-sm text-gray-600">Digestive support</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerbDetail;

