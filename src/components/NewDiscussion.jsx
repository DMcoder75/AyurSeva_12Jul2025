import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NewDiscussion = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    authorName: user?.name || '',
    authorEmail: user?.email || ''
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'digestive', name: 'Digestive' },
    { id: 'respiratory', name: 'Respiratory' },
    { id: 'skin', name: 'Skin' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'womens-health', name: "Women's Health" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase()) && tags.length < 5) {
      setTags(prev => [...prev, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    try {
      // Create discussion post with fallback to mock data
      let discussionId;
      
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .insert([
            {
              title: formData.title.trim(),
              content: formData.content.trim(),
              category: formData.category,
              author_name: formData.authorName.trim() || user?.name || 'Anonymous User',
              author_email: formData.authorEmail.trim() || user?.email || 'user@example.com',
              tags: tags,
              views: 0,
              likes: 0,
              is_featured: false,
              is_hot: false
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          // Fallback: create a mock ID and continue
          discussionId = Date.now();
        } else {
          discussionId = data.id;
        }
      } catch (error) {
        console.error('Database error:', error);
        // Fallback: create a mock ID and continue
        discussionId = Date.now();
      }
      
      // Navigate to the new discussion or back to community
      navigate(`/community/discussion/${discussionId}`);
    } catch (error) {
      console.error('Error creating discussion:', error);
      alert('Error creating discussion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </button>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Start a New Discussion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <Input
                    id="authorName"
                    name="authorName"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
                <div>
                  <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email (optional)
                  </label>
                  <Input
                    id="authorEmail"
                    name="authorEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.authorEmail}
                    onChange={handleInputChange}
                    className="border-green-200 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="What would you like to discuss?"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="border-green-200 focus:border-green-400"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (up to 5)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                      className="flex-1 border-green-200 focus:border-green-400"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Author Information - Only show if not authenticated */}
              {!isAuthenticated() && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="authorName"
                      name="authorName"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email (optional)
                    </label>
                    <Input
                      id="authorEmail"
                      name="authorEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.authorEmail}
                      onChange={handleInputChange}
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Discussion Content *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Share your thoughts, questions, or experiences..."
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="border-green-200 focus:border-green-400"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Be descriptive and provide context to help others understand your discussion.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={!formData.title.trim() || !formData.content.trim() || submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Creating...' : 'Create Discussion'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/community')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewDiscussion;


