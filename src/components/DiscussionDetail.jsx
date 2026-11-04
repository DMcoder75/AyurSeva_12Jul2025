import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import { ArrowLeft, MessageCircle, Heart, Share2, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';

const DiscussionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDiscussionDetail();
    }
  }, [id]);

  const fetchDiscussionDetail = async () => {
    try {
      setLoading(true);
      
      // Fetch discussion details
      const { data: discussionData, error: discussionError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (discussionError) {
        console.error('Error fetching discussion:', discussionError);
        // Use fallback data
        setDiscussion(getFallbackDiscussion(id));
      } else {
        setDiscussion({
          ...discussionData,
          author: discussionData.author_name,
          lastActivity: formatTimeAgo(discussionData.updated_at)
        });
        
        // Increment view count
        await supabase
          .from('community_posts')
          .update({ views: discussionData.views + 1 })
          .eq('id', id);
      }

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        setComments(getFallbackComments(id));
      } else {
        setComments(commentsData.map(comment => ({
          ...comment,
          author: comment.author_name,
          timeAgo: formatTimeAgo(comment.created_at)
        })));
      }
    } catch (error) {
      console.error('Error in fetchDiscussionDetail:', error);
      setDiscussion(getFallbackDiscussion(id));
      setComments(getFallbackComments(id));
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert([
          {
            post_id: id,
            content: newComment.trim(),
            author_name: 'Anonymous User', // In a real app, this would come from auth
            author_email: 'user@example.com'
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error submitting comment:', error);
        // Add comment locally as fallback
        const newCommentObj = {
          id: Date.now(),
          content: newComment.trim(),
          author: 'Anonymous User',
          timeAgo: 'Just now',
          likes: 0
        };
        setComments(prev => [...prev, newCommentObj]);
      } else {
        // Add the new comment to the list
        const newCommentObj = {
          ...data,
          author: data.author_name,
          timeAgo: 'Just now'
        };
        setComments(prev => [...prev, newCommentObj]);
      }

      setNewComment('');
    } catch (error) {
      console.error('Error in handleSubmitComment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeDiscussion = async () => {
    if (!discussion) return;
    
    const newLikeCount = userLiked ? discussion.likes - 1 : discussion.likes + 1;
    setUserLiked(!userLiked);
    setDiscussion(prev => ({ ...prev, likes: newLikeCount }));

    // Update in database
    try {
      await supabase
        .from('community_posts')
        .update({ likes: newLikeCount })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const getFallbackDiscussion = (discussionId) => {
    const fallbackDiscussions = {
      '1': {
        id: 1,
        title: 'Best time to take Ashwagandha for stress relief?',
        content: 'I\'ve been taking Ashwagandha for a few weeks now, but I\'m not sure about the optimal timing. Should I take it in the morning or evening? What has worked best for you?\n\nI\'ve read conflicting information online - some sources say morning for energy, others say evening for better sleep. I\'m currently taking 300mg daily but haven\'t found the sweet spot for timing.\n\nWould love to hear your experiences and any tips you might have!',
        author: 'Sarah M.',
        category: 'mental-health',
        tags: ['ashwagandha', 'stress', 'timing'],
        views: 456,
        likes: 23,
        lastActivity: '2 hours ago',
        isHot: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      '2': {
        id: 2,
        title: 'Turmeric golden milk recipe variations - share yours!',
        content: 'I love making golden milk but want to try new variations. Here\'s my basic recipe:\n\n- 1 cup milk (I use oat milk)\n- 1 tsp turmeric powder\n- Pinch of black pepper\n- Honey to taste\n- Small piece of fresh ginger\n\nWhat are your favorite additions? I\'ve heard about adding cardamom, cinnamon, or even ashwagandha. Would love to try your recipes!',
        author: 'Raj P.',
        category: 'digestive',
        tags: ['turmeric', 'golden-milk', 'recipes'],
        views: 342,
        likes: 18,
        lastActivity: '4 hours ago',
        isHot: false,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    };
    
    return fallbackDiscussions[discussionId] || fallbackDiscussions['1'];
  };

  const getFallbackComments = (discussionId) => {
    const fallbackComments = {
      '1': [
        {
          id: 1,
          content: 'I take mine in the evening about 2 hours before bed. It really helps me wind down and sleep better!',
          author: 'Sleep Better',
          timeAgo: '1 hour ago',
          likes: 5
        },
        {
          id: 2,
          content: 'Morning works better for me. I find it gives me sustained energy throughout the day without the jitters.',
          author: 'Morning Person',
          timeAgo: '45 minutes ago',
          likes: 3
        },
        {
          id: 3,
          content: 'I split my dose - half in the morning, half in the evening. Best of both worlds!',
          author: 'Balanced Approach',
          timeAgo: '30 minutes ago',
          likes: 7
        }
      ],
      '2': [
        {
          id: 4,
          content: 'I add a pinch of cardamom and cinnamon - it makes it taste amazing! Also try adding a little ghee.',
          author: 'Spice Lover',
          timeAgo: '2 hours ago',
          likes: 4
        },
        {
          id: 5,
          content: 'Rose petals make a beautiful addition! And I sometimes add a date for natural sweetness.',
          author: 'Floral Touch',
          timeAgo: '1 hour ago',
          likes: 6
        }
      ]
    };
    
    return fallbackComments[discussionId] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Discussion Not Found</h1>
          <p className="text-gray-600 mb-6">The discussion you're looking for doesn't exist.</p>
          <Link to="/community">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <TwoColumnLayout 
      sidebar={<Sidebar type="community" />}
      className="min-h-screen bg-gray-50 py-8"
    >
      {/* Back Button */}
      <Link to="/community" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Community
      </Link>

      {/* Discussion Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {discussion.isHot && (
                  <Badge variant="destructive" className="text-xs">
                    🔥 Hot
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {discussion.category}
                </Badge>
              </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {discussion.title}
                </h1>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {discussion.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{discussion.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{discussion.lastActivity}</span>
                  </div>
                  <span>{discussion.views} views</span>
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">
                    {discussion.author.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Discussion Content */}
            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700">
                {discussion.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLikeDiscussion}
                className={userLiked ? 'text-red-600 border-red-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-2 ${userLiked ? 'fill-current' : ''}`} />
                {discussion.likes} {discussion.likes === 1 ? 'Like' : 'Likes'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <Textarea
                placeholder="Share your thoughts or experiences..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button 
                type="submit" 
                disabled={!newComment.trim() || submittingComment}
                className="bg-green-600 hover:bg-green-700"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-green-200 pl-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm font-medium">
                        {comment.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">{comment.timeAgo}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likes || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </TwoColumnLayout>
  );
};

export default DiscussionDetail;

