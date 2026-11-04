import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Bookmark, Star, Activity, Bell, HelpCircle, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Debug: Log user data to console
  console.log('Profile component user data:', user);
  console.log('Profile component loading:', loading);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Use real user data only
  const userData = {
    name: user.name || 'User',
    email: user.email || '',
    joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'December 2024',
    avatar: user.avatar_url || null,
    badges: [
      { name: 'Early Adopter', icon: '🌟', description: 'Joined in the first month' },
      { name: 'Helpful Contributor', icon: '🤝', description: '50+ helpful reviews' },
      { name: 'Remedy Explorer', icon: '🔍', description: 'Tried 25+ remedies' },
      { name: 'Community Builder', icon: '👥', description: 'Active in discussions' }
    ],
    stats: {
      savedRemedies: 23,
      reviewsWritten: 12,
      discussionPosts: 8,
      helpfulVotes: 156
    }
  };

  const savedRemedies = [
    {
      id: 1,
      name: 'Turmeric Golden Milk',
      category: 'Anti-inflammatory',
      savedDate: '2 days ago',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Ginger Honey Tea',
      category: 'Digestive',
      savedDate: '1 week ago',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Ashwagandha Tonic',
      category: 'Stress Relief',
      savedDate: '2 weeks ago',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Neem Face Pack',
      category: 'Skin Care',
      savedDate: '3 weeks ago',
      rating: 4.5
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'review',
      action: 'Reviewed "Turmeric Golden Milk"',
      time: '2 hours ago',
      rating: 5
    },
    {
      id: 2,
      type: 'discussion',
      action: 'Posted in "Best herbs for winter immunity"',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'save',
      action: 'Saved "Ginger Honey Tea" remedy',
      time: '3 days ago'
    },
    {
      id: 4,
      type: 'badge',
      action: 'Earned "Helpful Contributor" badge',
      time: '1 week ago'
    }
  ];

  const myReviews = [
    {
      id: 1,
      remedy: 'Turmeric Golden Milk',
      rating: 5,
      text: 'This has become part of my nightly routine. Great for joint pain!',
      date: '2 hours ago',
      helpful: 12
    },
    {
      id: 2,
      remedy: 'Ashwagandha Tonic',
      rating: 4,
      text: 'Definitely helps with stress, but taste takes getting used to.',
      date: '1 week ago',
      helpful: 8
    },
    {
      id: 3,
      remedy: 'Ginger Honey Tea',
      rating: 5,
      text: 'Perfect for digestive issues. Simple and effective.',
      date: '2 weeks ago',
      helpful: 15
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <TwoColumnLayout 
      sidebar={<Sidebar type="profile" />}
      className="min-h-screen bg-gray-50 py-8"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-green-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/profile/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

          {/* Badges */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {userData.badges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-medium text-green-700">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Bookmark className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Saved Remedies</span>
                  </div>
                  <span className="font-semibold">{userData.stats.savedRemedies}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Reviews Written</span>
                  </div>
                  <span className="font-semibold">{userData.stats.reviewsWritten}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Discussion Posts</span>
                  </div>
                  <span className="font-semibold">{userData.stats.discussionPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">👍</span>
                    <span className="text-sm text-gray-600">Helpful Votes</span>
                  </div>
                  <span className="font-semibold">{userData.stats.helpfulVotes}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="saved">Saved Remedies</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.slice(0, 4).map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                            {activity.rating && (
                              <div className="flex">
                                {renderStars(activity.rating)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended for You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Winter Immunity Boost</h4>
                          <p className="text-sm text-gray-600">Based on your interest in immune support</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Joint Health Discussion</h4>
                          <p className="text-sm text-gray-600">Join the conversation about natural joint care</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Stress Management Workshop</h4>
                          <p className="text-sm text-gray-600">Learn Ayurvedic stress relief techniques</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Remedies ({savedRemedies.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {savedRemedies.map((remedy) => (
                        <Link key={remedy.id} to={`/remedy/${remedy.id}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{remedy.name}</h3>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                  <span className="text-sm text-gray-600">{remedy.rating}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="mb-2">{remedy.category}</Badge>
                              <p className="text-sm text-gray-500">Saved {remedy.savedDate}</p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Reviews ({myReviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {myReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start mb-2">
                            <Link to={`/remedy/${review.id}`} className="font-semibold text-gray-900 hover:text-green-600">
                              {review.remedy}
                            </Link>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700 mb-2">{review.text}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{review.helpful} people found this helpful</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                          {activity.rating && (
                            <div className="flex">
                              {renderStars(activity.rating)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
    </TwoColumnLayout>
  );
};

export default Profile;

