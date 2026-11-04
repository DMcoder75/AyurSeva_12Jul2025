import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Fetch user profile from your 'user_profiles' table
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
              setUser(null);
            } else {
              const userData = {
                id: session.user.id,
                email: session.user.email,
                name: profile?.name || session.user.email,
                role: profile?.role || 'general',
                status: profile?.status || 'active',
                verified: profile?.verified || false,
                avatar_url: profile?.avatar_url || null,
                bio: profile?.bio || null,
                location: profile?.location || null,
                phone: profile?.phone || null,
                date_of_birth: profile?.date_of_birth || null,
                interests: profile?.interests || null,
                experience: profile?.experience || null,
                created_at: profile?.created_at || null
              };
              setUser(userData);
              localStorage.setItem('ayurseva_user', JSON.stringify(userData));
            }
            setLoading(false);
          });
      } else {
        setUser(null);
        localStorage.removeItem('ayurseva_user');
        setLoading(false);
      }
    });

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching user profile on initial load:', profileError);
              setUser(null);
            } else {
              const userData = {
                id: session.user.id,
                email: session.user.email,
                name: profile?.name || session.user.email,
                role: profile?.role || 'general',
                status: profile?.status || 'active',
                verified: profile?.verified || false
              };
              setUser(userData);
              localStorage.setItem('ayurseva_user', JSON.stringify(userData));
            }
          });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔐 Starting sign in process for:', email);

      // For admin user, load from database directly
      if (email === 'newadmin@ayurseva.com') {
        console.log('👑 Admin login detected, fetching from database');
        
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', email)
          .single();

        console.log('📊 Admin profile query result:', { profileData, profileError });

        if (profileError) {
          console.error('❌ Admin profile error:', profileError);
          throw new Error('Admin user not found in database');
        }

        const userData = {
          id: profileData.user_id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          status: profileData.status,
          verified: profileData.verified
        };

        setUser(userData);
        localStorage.setItem('ayurseva_user', JSON.stringify(userData));
        
        console.log('✅ Admin user signed in successfully:', userData);
        return { user: userData, error: null };
      }

      // For other users, try Supabase auth
      console.log('🔑 Attempting Supabase auth for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('📊 Supabase auth result:', { data, error });

      if (error) {
        console.error('❌ Supabase auth error:', error);
        throw error;
      }

      // Log JWT token
      if (data.session?.access_token) {
        console.log('🔑 User JWT token:', data.session.access_token);
      }

      // Get user profile data
      if (data.user) {
        console.log('👤 Fetching user profile for:', email);
        
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', email)
          .single();

        console.log('📊 User profile query result:', { profile, profileError });

        if (profileError) {
          console.error('❌ User profile error:', profileError);
          console.error('❌ Full error object:', JSON.stringify(profileError, null, 2));
          throw new Error(`Database error querying schema: ${profileError.message}`);
        }

        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.email,
          role: profile?.role || 'general',
          status: profile?.status || 'active',
          avatar_url: profile?.avatar_url || null,
          bio: profile?.bio || null,
          location: profile?.location || null,
          phone: profile?.phone || null,
          date_of_birth: profile?.date_of_birth || null,
          interests: profile?.interests || null,
          experience: profile?.experience || null,
          created_at: profile?.created_at || null
        };

        setUser(userData);
        localStorage.setItem('ayurseva_user', JSON.stringify(userData));
        
        console.log('✅ User signed in successfully:', userData);
        return { user: userData, error: null };
      }

    } catch (error) {
      console.error('💥 Sign in error:', error);
      console.error('💥 Full error object:', JSON.stringify(error, null, 2));
      setError(error.message);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      return { user: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('ayurseva_user');
      // Remove navigate call - let components handle navigation
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Prepare update data with proper null handling for date fields
      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth && profileData.dateOfBirth.trim() !== '' ? profileData.dateOfBirth : null,
        interests: profileData.interests,
        experience: profileData.experience,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Updating profile with data:', updateData);

      // Update user_profiles table
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local user state
      const updatedUser = {
        ...user,
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth && profileData.dateOfBirth.trim() !== '' ? profileData.dateOfBirth : null,
        interests: profileData.interests,
        experience: profileData.experience,
        avatar_url: profileData.avatar_url
      };

      setUser(updatedUser);
      localStorage.setItem('ayurseva_user', JSON.stringify(updatedUser));

      console.log('✅ Profile updated successfully');
      return { success: true, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.email === 'newadmin@ayurseva.com';
  };

  const isDoctor = () => {
    const result = user?.role === 'doctor';
    console.log('🩺 isDoctor() called - user role:', user?.role, 'result:', result);
    return result;
  };

  const isPatient = () => {
    return user?.role === 'patient' || user?.role === 'general' || (!user?.role && user);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const canAccessConsultations = () => {
    return isAuthenticated() && (isDoctor() || isPatient());
  };

  const canProvideConsultations = () => {
    return isDoctor();
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isDoctor,
    isPatient,
    isAuthenticated,
    canAccessConsultations,
    canProvideConsultations,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


