import React, { useState, useEffect } from 'react';
import { PublicFeedbackView } from './PublicFeedbackView';
import { useFeedbackData } from '../hooks/useFeedbackData';

interface WidgetViewProps {
  apiKey: string;
  theme?: 'light' | 'dark';
}

export const WidgetView: React.FC<WidgetViewProps> = ({ apiKey, theme = 'light' }) => {
  const [isValidKey, setIsValidKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate API key (in real app, this would be a server call)
    const validateApiKey = async () => {
      try {
        // For demo purposes, we'll accept any non-empty key
        // In production, this would validate against your backend
        if (apiKey && apiKey.length > 0) {
          setIsValidKey(true);
        } else {
          setIsValidKey(false);
        }
      } catch (error) {
        setIsValidKey(false);
      } finally {
        setLoading(false);
      }
    };

    validateApiKey();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isValidKey) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Invalid API Key</div>
          <div className="text-gray-600 text-sm">Please check your API key and try again</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full ${theme === 'dark' ? 'dark' : ''}`}>
      <PublicFeedbackView isWidget={true} apiKey={apiKey} />
    </div>
  );
};