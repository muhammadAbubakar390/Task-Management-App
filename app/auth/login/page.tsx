'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== LOGIN DEBUG START ===');
    console.log('Form submitted with:', formData);

    try {
      // Validate input
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Create mock user data
      const mockUser = {
        id: 'user-' + Date.now(),
        email: formData.email,
        name: formData.email.split('@')[0] || 'User',
        role: 'USER'
      };

      console.log('Creating mock user:', mockUser);

      // Save to localStorage
      localStorage.setItem('accessToken', 'token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      console.log('LocalStorage after save:');
      console.log('- accessToken:', localStorage.getItem('accessToken'));
      console.log('- user:', localStorage.getItem('user'));

      // Add a small delay to ensure localStorage is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Attempting to redirect to /dashboard');
      
      // Try multiple ways to redirect
      router.push('/dashboard');
      
      // Also try with replace
      setTimeout(() => {
        router.replace('/dashboard');
      }, 200);
      
      // And try window.location as backup
      setTimeout(() => {
        console.log('Fallback redirect using window.location');
        window.location.href = '/dashboard';
      }, 500);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
      console.log('=== LOGIN DEBUG END ===');
    }
  };

  // Direct test function
  const handleDirectTest = () => {
    console.log('Direct test login triggered');
    
    const testUser = {
      id: 'test-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN'
    };
    
    localStorage.setItem('accessToken', 'test-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(testUser));
    
    console.log('Saved to localStorage. Now redirecting...');
    
    // Try all redirect methods
    router.push('/dashboard');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  // Check if already logged in
  const checkIfLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      console.log('Current localStorage user:', user);
      if (user) {
        alert('You are already logged in! Redirecting...');
        router.push('/dashboard');
      } else {
        alert('No user found in localStorage');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Debug mode enabled</p>
        </div>

        {/* Debug Controls */}
        <div className="space-y-2 p-4 bg-yellow-50 rounded-md border border-yellow-200">
          <h3 className="font-semibold text-yellow-800">Debug Controls:</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleDirectTest}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
            >
              Quick Test Login
            </button>
            <button
              type="button"
              onClick={checkIfLoggedIn}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
            >
              Check Login Status
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                alert('LocalStorage cleared!');
              }}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any password works"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Sign in'}
          </button>

          <div className="text-center">
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Create new account
            </Link>
          </div>
        </form>

        <div className="p-4 bg-gray-50 rounded-md text-sm">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Form Data: {JSON.stringify(formData)}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Router ready: {router ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}