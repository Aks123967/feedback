import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useFeedbackData } from '../hooks/useFeedbackData';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  CogIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onCreateClick?: () => void;
  showCreateButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  onCreateClick, 
  showCreateButton = true 
}) => {
  const { user, logout } = useAuth();
  const { getOrCreateApiKey } = useFeedbackData();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (user) {
      const key = getOrCreateApiKey(user.id);
      setApiKey(key);
    }
  }, [user, getOrCreateApiKey]);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  const copyEmbedCode = () => {
    const embedCode = `<!-- Feedback Widget -->
<script src="${window.location.origin}/sdk/feedback-sdk.js"></script>
<script>
  new FeedbackSDK({
    apiKey: '${apiKey}',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    title: 'Feedback'
  });
</script>`;
    navigator.clipboard.writeText(embedCode);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <UserCircleIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>

            {/* Action Buttons */}
            <Button variant="outline" size="sm" onClick={() => setShowApiKey(true)}>
              <KeyIcon className="w-4 h-4 mr-2" />
              API Key
            </Button>
            
            <Button variant="ghost" size="sm">
              <CogIcon className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            {showCreateButton && onCreateClick && (
              <Button size="sm" onClick={onCreateClick}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Feature Request
              </Button>
            )}

            {/* Logout Button */}
            <Button variant="outline" size="sm" onClick={logout}>
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* API Key Modal */}
      {showApiKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Embed Feedback Widget</h3>
              <button
                onClick={() => setShowApiKey(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
                <div className="flex">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={copyApiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Feedback Widget -->
<script src="${window.location.origin}/sdk/feedback-sdk.js"></script>
<script>
  new FeedbackSDK({
    apiKey: '${apiKey}',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    title: 'Feedback'
  });
</script>`}
                  </pre>
                  <button
                    onClick={copyEmbedCode}
                    className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Integration Options</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Position:</strong> 'bottom-right', 'bottom-left', 'top-right', 'top-left'</li>
                  <li>• <strong>Theme:</strong> 'light', 'dark'</li>
                  <li>• <strong>Primary Color:</strong> Any hex color code</li>
                  <li>• <strong>Title:</strong> Custom widget title</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};