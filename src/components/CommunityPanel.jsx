import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { MessageCircle, Users, TrendingUp, Bell, User, Clock, Eye, Heart } from 'lucide-react';

const CommunityPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [userDiscussions, setUserDiscussions] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      fetchRecentDiscussions();
    }
  }, [isAuthenticated, user]);

  const fetchRecentDiscussions = async () => {
    try {
      // Fetch recent community discussions for non-logged users
      const discussions = [
        {
          id: 1,
          title: "Best time to take Ashwagandha for stress relief?",
          author: "Sarah M.",
          category: "Mental Health",
          replies: 23,
          views: 456,
          timeAgo: "2 hours ago",
          isHot: true
        },
        {
          id: 2,
          title: "Turmeric golden milk recipe variations - share yours!",
          author: "Raj P.",
          category: "Digestive",
          replies: 18,
          views: 342,
          timeAgo: "4 hours ago",
          isHot: false
        },
        {
          id: 3,
          title: "Natural remedies for seasonal allergies that actually work",
          author: "Emily R.",
          category: "Respiratory",
          replies: 31,
          views: 678,
          timeAgo: "6 hours ago",
          isHot: true
        },
        {
          id: 4,
          title: "Ayurvedic skincare routine for sensitive skin",
          author: "Maya K.",
          category: "Skin",
          replies: 15,
          views: 289,
          timeAgo: "8 hours ago",
          isHot: false
        }
      ];
      setRecentDiscussions(discussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch user's own discussions
      const userPosts = [
        {
          id: 1,
          title: "My experience with Triphala for digestive health",
          category: "Digestive",
          replies: 12,
          views: 234,
          timeAgo: "1 day ago",
          status: "active"
        },
        {
          id: 2,
          title: "Question about Brahmi dosage for memory",
          category: "Mental Health",
          replies: 8,
          views: 156,
          timeAgo: "3 days ago",
          status: "answered"
        }
      ];

      // Fetch user notifications (replies, mentions, etc.)
      const notifications = [
        {
          id: 1,
          type: "reply",
          message: "Dr. Sharma replied to your post about Triphala",
          discussion: "My experience with Triphala for digestive health",
          timeAgo: "30 minutes ago",
          isRead: false
        },
        {
          id: 2,
          type: "like",
          message: "5 people liked your comment on Ashwagandha timing",
          discussion: "Best time to take Ashwagandha for stress relief?",
          timeAgo: "2 hours ago",
          isRead: false
        },
        {
          id: 3,
          type: "mention",
          message: "You were mentioned in a discussion about turmeric",
          discussion: "Turmeric golden milk recipe variations",
          timeAgo: "1 day ago",
          isRead: true
        }
      ];

      setUserDiscussions(userPosts);
      setUserNotifications(notifications);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadCount = () => {
    return userNotifications.filter(notif => !notif.isRead).length;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Non-logged user view - Recent community discussions
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Community Discussions</h3>
            </div>
            <div className="flex items-center space-x-4 text-green-100">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">12,847 members</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Active now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentDiscussions.map((discussion) => (
              <div key={discussion.id} className="border-l-4 border-green-200 pl-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {discussion.isHot && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                          🔥 HOT
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {discussion.category}
                      </span>
                    </div>
                    <Link 
                      to={`/community/discussion/${discussion.id}`}
                      className="text-gray-900 font-medium hover:text-green-600 transition-colors line-clamp-2"
                    >
                      {discussion.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>by {discussion.author}</span>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{discussion.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Join our community to participate in discussions</p>
              <div className="flex space-x-3">
                <Link 
                  to="/login" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Community
                </Link>
                <Link 
                  to="/community" 
                  className="text-green-600 border border-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in user view - Personalized dashboard
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-white" />
            <h3 className="text-xl font-semibold text-white">Your Community Activity</h3>
          </div>
          {getUnreadCount() > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {getUnreadCount()} new
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('recent')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recent'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Your Posts ({userDiscussions.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
              activeTab === 'notifications'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {getUnreadCount() > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getUnreadCount()}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'recent' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Recent discussions from the community
            </div>
            {recentDiscussions.slice(0, 3).map((discussion) => (
              <div key={discussion.id} className="border-l-4 border-blue-200 pl-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2 mb-1">
                  {discussion.isHot && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                      🔥 HOT
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {discussion.category}
                  </span>
                </div>
                <Link 
                  to={`/community/discussion/${discussion.id}`}
                  className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                >
                  {discussion.title}
                </Link>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>by {discussion.author}</span>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{discussion.replies}</span>
                  </div>
                  <span>{discussion.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userDiscussions.map((post) => (
              <div key={post.id} className="border-l-4 border-green-200 pl-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <Link 
                  to={`/community/discussion/${post.id}`}
                  className="text-gray-900 font-medium hover:text-green-600 transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                  <span>{post.timeAgo}</span>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link 
                to="/community/new" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Start New Discussion
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {userNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${
                  notification.isRead 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'reply' ? 'bg-green-100' :
                    notification.type === 'like' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {notification.type === 'reply' && <MessageCircle className="h-4 w-4 text-green-600" />}
                    {notification.type === 'like' && <Heart className="h-4 w-4 text-red-600" />}
                    {notification.type === 'mention' && <Bell className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      in "{notification.discussion}" • {notification.timeAgo}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link 
            to="/community" 
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View Full Community →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityPanel;

