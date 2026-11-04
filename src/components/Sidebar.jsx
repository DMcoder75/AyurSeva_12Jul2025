import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Users, Star, ArrowRight, Heart, MessageCircle, Eye } from 'lucide-react';

const Sidebar = ({ type = "general", currentPage = "" }) => {
  // Quick Links component
  const QuickLinks = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ArrowRight className="h-5 w-5 text-green-600 mr-2" />
        Quick Links
      </h3>
      <div className="space-y-3">
        <Link to="/remedies" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
          Browse All Remedies
        </Link>
        <Link to="/issues" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
          Health Issues Guide
        </Link>
        <Link to="/herbs" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
          Herbal Encyclopedia
        </Link>
        <Link to="/community" className="block text-sm text-gray-600 hover:text-green-600 transition-colors">
          Community Discussions
        </Link>
      </div>
    </div>
  );

  // Popular Content component
  const PopularContent = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
        Popular This Week
      </h3>
      <div className="space-y-4">
        {/* Remedies */}
        <div className="border-b border-gray-100 pb-3">
          <Link to="/remedies/honey-water" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Honey Water
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.8k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>95 likes</span>
            </div>
          </Link>
        </div>
        <div className="border-b border-gray-100 pb-3">
          <Link to="/remedies/gotu-kola-tea" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Gotu Kola Tea
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.7k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>92 likes</span>
            </div>
          </Link>
        </div>
        {/* Herbs */}
        <div className="border-b border-gray-100 pb-3">
          <Link to="/herbs/neem" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Neem
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.6k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>90 likes</span>
            </div>
          </Link>
        </div>
        <div className="border-b border-gray-100 pb-3">
          <Link to="/herbs/ashwagandha" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Ashwagandha
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.5k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>88 likes</span>
            </div>
          </Link>
        </div>
        {/* Issues */}
        <div className="border-b border-gray-100 pb-3">
          <Link to="/issues/arthritis" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Arthritis
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.4k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>85 likes</span>
            </div>
          </Link>
        </div>
        <div>
          <Link to="/issues/bad-breath" className="block">
            <h4 className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors">
              Bad Breath
            </h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>1.3k views</span>
              <Heart className="h-3 w-3 ml-3 mr-1" />
              <span>82 likes</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  // Recent Activity component
  const RecentActivity = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 text-green-600 mr-2" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">New discussion about seasonal allergies</p>
            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">New remedy added: Neem Face Pack</p>
            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">50+ new community members joined</p>
            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Health Categories component
  const HealthCategories = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Health Categories
      </h3>
      <div className="space-y-2">
        <Link to="/category/digestive" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">💚 Digestive</span>
          <span className="text-xs text-gray-500">24 remedies</span>
        </Link>
        <Link to="/category/respiratory" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">💨 Respiratory</span>
          <span className="text-xs text-gray-500">18 remedies</span>
        </Link>
        <Link to="/category/skin" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">✨ Skin</span>
          <span className="text-xs text-gray-500">15 remedies</span>
        </Link>
        <Link to="/category/mental-health" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">🧠 Mental Health</span>
          <span className="text-xs text-gray-500">12 remedies</span>
        </Link>
        <Link to="/category/pain-relief" className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">⚡ Pain Relief</span>
          <span className="text-xs text-gray-500">20 remedies</span>
        </Link>
      </div>
    </div>
  );

  // Community Stats component
  const CommunityStats = () => (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Users className="h-5 w-5 text-green-600 mr-2" />
        Community
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Active Members</span>
          <span className="text-sm font-semibold text-gray-900">2,847</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Discussions</span>
          <span className="text-sm font-semibold text-gray-900">1,234</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Remedies Shared</span>
          <span className="text-sm font-semibold text-gray-900">856</span>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <Link to="/community" className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Join Community
          </Link>
        </div>
      </div>
    </div>
  );

  // Render different sidebar content based on page type
  const renderSidebarContent = () => {
    switch (type) {
      case 'homepage':
        return (
          <>
            <QuickLinks />
            <PopularContent />
            <HealthCategories />
            <CommunityStats />
          </>
        );
      case 'remedies':
        return (
          <>
            <HealthCategories />
            <PopularContent />
            <RecentActivity />
            <QuickLinks />
          </>
        );
      case 'community':
        return (
          <>
            <CommunityStats />
            <RecentActivity />
            <PopularContent />
            <QuickLinks />
          </>
        );
      case 'doctors':
        return (
          <>
            <HealthCategories />
            <CommunityStats />
            <PopularContent />
            <QuickLinks />
          </>
        );
      case 'profile':
        return (
          <>
            <RecentActivity />
            <PopularContent />
            <HealthCategories />
            <QuickLinks />
          </>
        );
      default:
        return (
          <>
            <QuickLinks />
            <PopularContent />
            <HealthCategories />
            <RecentActivity />
          </>
        );
    }
  };

  return renderSidebarContent();
};

export default Sidebar;

