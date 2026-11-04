import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Search, Plus, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const Community = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for when database is not available
  const fallbackCategories = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'digestive', name: 'Digestive', count: 2 },
    { id: 'respiratory', name: 'Respiratory', count: 1 },
    { id: 'skin', name: 'Skin', count: 1 },
    { id: 'mental-health', name: 'Mental Health', count: 2 },
    { id: 'womens-health', name: "Women's Health", count: 1 },
    { id: 'general', name: 'General', count: 1 }
  ];

  const fallbackDiscussions = [
    {
      id: 1,
      title: 'Best time to take Ashwagandha for stress relief?',
      author: 'Sarah M.',
      category: 'mental-health',
      replies: 23,
      views: 456,
      lastActivity: '2 hours ago',
      isHot: true,
      tags: ['ashwagandha', 'stress', 'timing']
    },
    {
      id: 2,
      title: 'Turmeric golden milk recipe variations - share yours!',
      author: 'Raj P.',
      category: 'digestive',
      replies: 18,
      views: 342,
      lastActivity: '4 hours ago',
      isHot: false,
      tags: ['turmeric', 'golden-milk', 'recipes']
    },
    {
      id: 3,
      title: 'Natural remedies for seasonal allergies that actually work',
      author: 'Emily R.',
      category: 'respiratory',
      replies: 31,
      views: 678,
      lastActivity: '6 hours ago',
      isHot: true,
      tags: ['allergies', 'respiratory', 'seasonal']
    }
  ];

  useEffect(() => {
    // Use fallback data for now
    setDiscussions(fallbackDiscussions);
    setCategories(fallbackCategories);
    setLoading(false);
  }, []);

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesCategory = activeCategory === 'all' || discussion.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
                         discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <TwoColumnLayout 
      sidebar={<Sidebar type="community" />}
      className="min-h-screen bg-gray-50 py-8"
    >
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Discussions</h1>
            <p className="text-gray-600">Connect with fellow wellness enthusiasts and share your Ayurvedic journey</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0" onClick={() => navigate('/new-discussion')}>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search discussions, topics, authors, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-green-200 focus:border-green-400"
            />
            {searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {filteredDiscussions.length} result{filteredDiscussions.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Categories */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex space-x-4">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {discussion.isHot && (
                              <Badge variant="destructive" className="text-xs">
                                🔥 Hot
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {categories.find(cat => cat.id === discussion.category)?.name}
                            </Badge>
                          </div>
                          
                          <Link to={`/community/discussion/${discussion.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 mb-2">
                              {discussion.title}
                            </h3>
                          </Link>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>by {discussion.author}</span>
                            <span>💬 {discussion.replies} replies</span>
                            <span>👁️ {discussion.views} views</span>
                            <span>Last activity {discussion.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
    </TwoColumnLayout>
  );
};

export default Community;

