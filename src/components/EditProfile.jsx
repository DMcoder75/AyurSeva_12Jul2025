import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Save, ArrowLeft, Upload, Mail, Calendar, MapPin, Phone, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TwoColumnLayout from './TwoColumnLayout';
import Sidebar from './Sidebar';
import supabase from '../lib/supabase';

const EditProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    dateOfBirth: '',
    interests: '',
    experience: ''
  });

  // Initialize form data with user information
  useEffect(() => {
    if (user) {
      // Only initialize form data if it's currently empty (first load)
      // This prevents form reset when user object updates after avatar upload
      const isFormEmpty = Object.values(formData).every(value => value === '');
      
      if (isFormEmpty) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          bio: user.bio || '',
          location: user.location || '',
          phone: user.phone || '',
          dateOfBirth: user.date_of_birth || '',
          interests: user.interests || '',
          experience: user.experience || ''
        });
      }
      
      // Always update avatar URL as it should reflect the latest uploaded image
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      setMessage('');

      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file.');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('File size must be less than 2MB.');
        return;
      }

      // Sanitize filename for Supabase Storage
      const sanitizeFilename = (filename) => {
        const fileExt = filename.split('.').pop();
        const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Replace special characters and spaces with underscores
        const sanitized = baseName
          .replace(/[^a-zA-Z0-9\-_]/g, '_') // Replace special chars with underscore
          .replace(/_{2,}/g, '_') // Replace multiple underscores with single
          .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
          .substring(0, 50); // Limit length to 50 characters
        
        return `${sanitized}.${fileExt}`;
      };

      const originalFilename = file.name;
      const sanitizedFilename = sanitizeFilename(originalFilename);
      const fileName = `${user.id}-${Date.now()}-${sanitizedFilename}`;
      const filePath = fileName;

      console.log('🔄 Uploading file:', {
        original: originalFilename,
        sanitized: sanitizedFilename,
        final: fileName,
        size: file.size,
        type: file.type
      });

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('✅ Upload successful:', publicUrl);
      setAvatarUrl(publicUrl);
      
      // Automatically save avatar URL to database
      try {
        await updateProfile({ avatar_url: publicUrl });
        setMessage('Profile picture uploaded and saved successfully!');
        console.log('✅ Avatar URL saved to database');
      } catch (dbError) {
        console.error('❌ Error saving avatar URL to database:', dbError);
        setMessage('Profile picture uploaded but failed to save to profile. Please click "Save Changes" to complete.');
      }
    } catch (error) {
      console.error('💥 Error uploading avatar:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Error uploading profile picture. Please try again.';
      
      if (error.message?.includes('Invalid key')) {
        errorMessage = 'Invalid filename. Please rename your file and try again.';
      } else if (error.message?.includes('413')) {
        errorMessage = 'File is too large. Please choose a smaller image.';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Permission denied. Please try logging out and back in.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setMessage(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Include avatar URL in the update
      const updateData = {
        ...formData,
        avatar_url: avatarUrl
      };

      // Update profile data
      await updateProfile(updateData);
      setMessage('Profile updated successfully!');
      
      // Redirect back to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

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
          <p className="text-gray-600 mb-6">You need to be logged in to edit your profile.</p>
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

  return (
    <TwoColumnLayout 
      sidebar={<Sidebar type="profile" />}
      className="min-h-screen bg-gray-50 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-2">Update your personal information and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your interest in Ayurveda, and your health journey..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests">Health Interests</Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Digestive Health, Stress Management, Immunity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Ayurveda Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Share your experience with Ayurvedic practices, remedies you've tried, or your wellness journey..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Picture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-green-600" />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      {avatarUrl ? 'Change Picture' : 'Upload Picture'}
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </TwoColumnLayout>
  );
};

export default EditProfile;

