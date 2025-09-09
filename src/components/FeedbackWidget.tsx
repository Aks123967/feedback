import React, { useState } from 'react';
import { PublicFeedbackView } from './PublicFeedbackView';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for data updates and refresh widget content
  React.useEffect(() => {
    const handleDataUpdate = () => {
      // Force re-render of widget content when data updates
      if (isOpen) {
        // Trigger a re-render by toggling a state or using a key
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 10);
      }
    };

    window.addEventListener('feedbackDataUpdated', handleDataUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'feedback-requests') {
        handleDataUpdate();
      }
    });

    return () => {
      window.removeEventListener('feedbackDataUpdated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, [isOpen]);
  return (
    <>
      {/* Widget Trigger Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <ChatBubbleLeftIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <PublicFeedbackView isWidget={true} />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};