import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../config/supabaseClient.js';
import api from '../services/api.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user and load profile data
    const loadUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        setUser(user);
        // Load full name from user_metadata
        setFullName(user?.user_metadata?.full_name || '');
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put('/user', {
        full_name: fullName.trim() || undefined
      });

      if (response.data.user) {
        // Update local user state
        setUser(response.data.user);
        setSuccess('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your tasks and data.'
    );

    if (!confirmed) {
      return;
    }

    // Double confirmation
    const doubleConfirmed = window.confirm(
      'This is your last chance. Are you absolutely sure you want to delete your account?'
    );

    if (!doubleConfirmed) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      await api.delete('/user');

      // Clear local storage and session
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error deleting account:', err);
      let errorMessage = 'Failed to delete account. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.instructions) {
        errorMessage = err.response.data.message + '\n\n' + err.response.data.instructions.join('\n');
      }
      
      setError(errorMessage);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Task Management System
              </h1>
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-700">{user.email}</span>
              )}
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  navigate('/login');
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed from this page</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <p className="mt-1 text-sm text-gray-500 font-mono">{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h3>
            
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting Account...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
