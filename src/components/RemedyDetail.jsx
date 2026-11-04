import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const RemedyDetail = () => {
  const { slug } = useParams();
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Function to get remedy image based on name
  const getRemedyImage = (remedyName) => {
    if (!remedyName) return null;
    
    const cleanName = remedyName.split(' Description')[0];
    
    // Map remedy names to image filenames
    const imageMap = {
      'Eucalyptus Treatment': 'SectionImgEucalyptus_Treatment.png',
      'Eucalyptus Treatment (Steam Inhalation)': 'SectionImgEucalyptus_Treatment.png',
      'Turmeric Gargle': 'SectionImgTurmeric_Gargle.png',
      'Ginger Baking Soda Bath': 'SectionImgGinger_Baking_Soda_Bath.png',
      'Cumin, Coriander, Fennel Tea (CCF Tea)': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'Cumin Coriander Fennel Tea CCF Tea': 'SectionImgCumin_Coriander_FennelTea_CCF_Tea.png',
      'Warm Milk with Nutmeg, Almonds, Cardamom for Insomnia': 'SectionImgWarm_Milk_Nutmeg_Almonds_Cardamom_Insomnia.png',
      'Triphala Powder for Digestion and Detox': 'SectionImgTriphala_Powder_Digestion_Detox.png',
      'Vata Balancing Diet': 'SectionImgVata_Balancing_Diet.png',
      'Pitta Balancing Diet': 'SectionImgPitta_Balancing_Diet.png',
      'Kapha Balancing Diet': 'SectionImgKapha_Balancing_Diet.png',
      'Ashwagandha, Bala, Vidari, Garlic Milk for Impotence': 'SectionImgAshwagandha_Bala_Vidari_Garlic_Milk_Impotence.png',
      'Jatamamsi, Musta, Tagar Tea for Hypertension': 'SectionImgJatamamsi_Musta_Tagar_Tea_Hypertension.png',
      'Kalka, Kama, Dudha Cream for Canker Sores, Hemorrhoids, Morning Sickness': 'SectionImgKalka_Kama_Dudha_Cream_Canker_Sores_Hemorrhoids_Morning_Sickness.png',
      'Brahmi Ghee on Cigarette for Smoking Cessation': 'SectionImgBrahmi_Ghee_Cigarette_Smoking_Cessation.png',
      'Cold, Congestion, Flu Tea': 'SectionImgCold_Congestion_Flu_Tea.png',
      'Cinnamon Honey for Cold and Cough': 'SectionImgCinnamon_Honey_Cold_Cough.png',
      'Ghee Hot Milk for Constipation': 'SectionImgGhee_Hot_Milk_Constipation.png'
    };

    return imageMap[cleanName] || null;
  };

  useEffect(() => {
    fetchRemedy();
  }, [slug]);

  const fetchRemedy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: remedyData, error: remedyError } = await supabase
        .from("remedies")
        .select("*")
        .ilike("slug", slug.toLowerCase())
        .limit(1);

      if (remedyError) {
        setError(`Failed to load remedy details: ${remedyError.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      if (!remedyData || remedyData.length === 0) {
        setError("Remedy not found.");
        setLoading(false);
        return;
      }

      const remedy = remedyData[0];

      const { data: remedyIngredientMappingData, error: remedyIngredientMappingError } = await supabase
        .from("remedyingredientmapping")
        .select("quantity, measure, optional, ing_form, ingredient_id")
        .eq("remedy_id", remedy.id);

      if (remedyIngredientMappingError) {
        setError(`Failed to load remedy ingredient mapping: ${remedyIngredientMappingError.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      const ingredientsWithDetails = await Promise.all(
        (remedyIngredientMappingData || []).map(async (mapping) => {
          const { data: ingredientDetail, error: ingredientDetailError } = await supabase
            .from("ingredients")
            .select("name, botanical_name, storage_instruction")
            .eq("ingredient_id", mapping.ingredient_id)
            .single();

          if (ingredientDetailError) {
            return { ...mapping, ingredients: null };
          }
          return { ...mapping, ingredients: ingredientDetail };
        })
      );

      const { data: preparationStepsData, error: preparationStepsError } = await supabase
        .from("preparation_steps")
        .select("step_number, instruction")
        .eq("remedy_id", remedy.id);

      if (preparationStepsError) {
        setError(`Failed to load preparation steps: ${preparationStepsError.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      setRemedy({
        ...remedy,
        remedyingredientmapping: ingredientsWithDetails || [],
        preparation_steps: preparationStepsData || [],
      });
      
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, { ...newReview, id: reviews.length + 1, user: 'You' }]);
    setNewReview({ rating: 5, comment: '' });
  };

  if (loading) {
    return <div className="text-center py-10">Loading remedy details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!remedy) {
    return <div className="text-center py-10">Remedy not found.</div>;
  }

  const remedyImage = getRemedyImage(remedy.name);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{remedy.name}</h1>
            <div className="flex items-center justify-center mt-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Traditional Remedy
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
          <Link to="/browse-remedies" className="hover:text-green-600">Remedies</Link>
          <span>/</span>
          <span className="text-gray-900">{remedy.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-3">Overview</h2>
              <p className="text-gray-700 mb-4">{remedy.description_long || remedy.description}</p>
            </div>

            {/* Ingredients Section */}
            {remedy.remedyingredientmapping && remedy.remedyingredientmapping.length > 0 && (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-3">Ingredients</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {remedy.remedyingredientmapping.map((mapping, index) => (
                    <li key={index}>
                      {mapping.quantity} {mapping.measure} {' '}
                      {mapping.ingredients?.name ? (
                        <Link 
                          to={`/herbs/${mapping.ingredient_id}`}
                          className="text-green-600 hover:text-green-800 hover:underline font-medium"
                          title={`View details about ${mapping.ingredients.name}`}
                        >
                          {mapping.ingredients.name}
                        </Link>
                      ) : (
                        <span>Unknown ingredient</span>
                      )}
                      {mapping.ingredients?.botanical_name && ` (${mapping.ingredients.botanical_name})`}
                      {mapping.ing_form && `, ${mapping.ing_form}`}
                      {mapping.optional && ` (Optional)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preparation Steps Section */}
            {remedy.preparation_steps && remedy.preparation_steps.length > 0 && (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-3">Preparation Steps</h2>
                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                  {remedy.preparation_steps
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step, index) => (
                      <li key={index}>
                        {step.instruction}
                      </li>
                    ))}
                </ol>
              </div>
            )}

            {/* Benefits Section */}
            {remedy.benefits && remedy.benefits.length > 0 && (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-3">Benefits</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {remedy.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Information Section */}
            {(remedy.side_effects && remedy.side_effects.length > 0) ||
            (remedy.contraindications && remedy.contraindications.length > 0) ||
            (remedy.drug_interactions && remedy.drug_interactions.length > 0) ||
            remedy.storage_instructions ? (
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-700 mb-3">Important Information</h2>
                {remedy.side_effects && remedy.side_effects.length > 0 && (
                  <p className="text-gray-700 mb-1"><strong>Side Effects:</strong> {remedy.side_effects.join(', ')}</p>
                )}
                {remedy.contraindications && remedy.contraindications.length > 0 && (
                  <p className="text-gray-700 mb-1"><strong>Contraindications:</strong> {remedy.contraindications.join(', ')}</p>
                )}
                {remedy.drug_interactions && remedy.drug_interactions.length > 0 && (
                  <p className="text-gray-700 mb-1"><strong>Drug Interactions:</strong> {remedy.drug_interactions.join(', ')}</p>
                )}
                {remedy.storage_instructions && (
                  <p className="text-gray-700"><strong>Storage:</strong> {remedy.storage_instructions}</p>
                )}
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Quick Info</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">Category</span>
                  <p className="text-gray-600">{remedy.category}</p>
                </div>
                {remedy.part_used && (
                  <div>
                    <span className="font-semibold text-gray-700">Part Used</span>
                    <p className="text-gray-600">{remedy.part_used}</p>
                  </div>
                )}
                {remedy.preparation_time && (
                  <div>
                    <span className="font-semibold text-gray-700">Preparation Time</span>
                    <p className="text-gray-600">{remedy.preparation_time}</p>
                  </div>
                )}
                {remedy.difficulty && (
                  <div>
                    <span className="font-semibold text-gray-700">Difficulty</span>
                    <p className="text-gray-600">{remedy.difficulty}</p>
                  </div>
                )}
                {remedy.servings && (
                  <div>
                    <span className="font-semibold text-gray-700">Servings</span>
                    <p className="text-gray-600">{remedy.servings}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Explore More */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-green-700 mb-3">Explore More</h2>
              <Link 
                to="/browse-remedies" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
              >
                Browse All Remedies
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width Below Two Columns */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review this remedy!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-800">{review.user}</span>
                    <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-green-700 mb-3">Add Your Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                <select
                  id="rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleReviewChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleReviewChange}
                  rows="4"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemedyDetail;

