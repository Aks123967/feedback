import React from 'react';
import { FeedbackWidget } from './FeedbackWidget';

export const DemoWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">Demo Company</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Services</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Welcome to Our
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text"> Demo Website</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            This is a demonstration website showcasing our feedback widget. Try clicking the feedback button in the bottom right corner!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-xl shadow">
              <a
                href="#"
                className="btn-primary w-full justify-center md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </a>
            </div>
            <div className="mt-3 rounded-xl shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="btn-secondary w-full justify-center md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card">
              <div className="stats-icon mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text mb-2">Fast Performance</h3>
              <p className="text-gray-600">Lightning-fast loading times and optimized performance for the best user experience.</p>
            </div>

            <div className="card">
              <div className="stats-icon mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text mb-2">Reliable</h3>
              <p className="text-gray-600">Built with reliability in mind, ensuring your applications run smoothly 24/7.</p>
            </div>

            <div className="card">
              <div className="stats-icon mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text mb-2">User-Friendly</h3>
              <p className="text-gray-600">Intuitive design and seamless user experience that your customers will love.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 card text-center">
          <h2 className="mb-4">
            Have feedback or feature requests?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            We'd love to hear from you! Click the feedback button to share your thoughts and help us improve.
          </p>
          <div className="flex items-center justify-center space-x-2 text-violet-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <span className="font-medium">Look for the feedback button in the bottom right corner</span>
          </div>
        </div>
      </main>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
};