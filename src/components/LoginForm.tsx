import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export const LoginForm: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (isSignupMode && !formData.name)) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignupMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const success = isSignupMode 
      ? await signup(formData.email, formData.password, formData.name)
      : await login(formData.email, formData.password);
      
    if (!success) {
      setError(isSignupMode ? 'Email already exists' : 'Invalid email or password');
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError('');
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            {isSignupMode ? 'Create your account' : 'Sign in to access the admin dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignupMode && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={error && !formData.name ? 'Name is required' : ''}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder={isSignupMode ? "Enter your email" : "admin@example.com"}
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={error && !formData.email ? 'Email is required' : ''}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder={isSignupMode ? "Create a password" : "Enter your password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={error && !formData.password ? 'Password is required' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {isSignupMode && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={error && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading 
              ? (isSignupMode ? 'Creating Account...' : 'Signing in...') 
              : (isSignupMode ? 'Create Account' : 'Sign In')
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignupMode 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {!isSignupMode && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
              <p><strong>User:</strong> user@example.com / user123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};