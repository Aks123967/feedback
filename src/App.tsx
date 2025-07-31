import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { DemoWebsite } from './components/DemoWebsite';
import { PublicFeedbackView } from './components/PublicFeedbackView';
import { FeatureRequestCard } from './components/FeatureRequestCard';
import { CreateFeatureRequestModal } from './components/CreateFeatureRequestModal';
import { FeatureRequestDetail } from './components/FeatureRequestDetail';
import { FilterSidebar } from './components/FilterSidebar';
import { Button } from './components/ui/Button';
import { useFeedbackData } from './hooks/useFeedbackData';
import { WidgetView } from './components/WidgetView';
import { FilterState } from './types/feedback';

function App() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'admin' | 'public' | 'demo'>('admin');
  const {
    featureRequests,
    labels,
    addFeatureRequest,
    updateFeatureRequest,
    addComment,
    addUpvote,
    filterRequests,
  } = useFeedbackData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    labels: [],
    sortBy: 'newest',
  });

  const filteredRequests = useMemo(() => {
    return filterRequests(featureRequests, filters);
  }, [featureRequests, filters, filterRequests]);

  const selectedRequest = selectedRequestId 
    ? featureRequests.find(req => req.id === selectedRequestId)
    : null;

  const handleAddComment = (content: string, isPublic: boolean) => {
    if (selectedRequestId) {
      addComment(selectedRequestId, {
        content,
        author: 'Admin',
        isPublic,
      });
    }
  };

  const handleAddUpvote = () => {
    if (selectedRequestId) {
      addUpvote(selectedRequestId, {
        userId: 'admin-' + Date.now(),
        userName: 'Admin User',
      });
    }
  };

  const handleUpdateStatus = (status: any) => {
    if (selectedRequestId) {
      updateFeatureRequest(selectedRequestId, { status });
    }
  };

  const handleUpdateLabels = (labelIds: string[]) => {
    if (selectedRequestId) {
      const newLabels = labels.filter(label => labelIds.includes(label.id));
      updateFeatureRequest(selectedRequestId, { labels: newLabels });
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Check if this is a widget embed request
  const urlParams = new URLSearchParams(window.location.search);
  const apiKey = urlParams.get('apiKey');
  const theme = urlParams.get('theme') || 'light';
  
  if ((window.location.pathname === '/widget' || urlParams.has('widget')) && apiKey) {
    return <WidgetView apiKey={apiKey} theme={theme as 'light' | 'dark'} />;
  }

  // View switcher for demo purposes
  const renderViewSwitcher = () => (
    <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
      <button
        onClick={() => setCurrentView('admin')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentView === 'admin' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Admin
      </button>
      <button
        onClick={() => setCurrentView('public')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentView === 'public' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Public
      </button>
      <button
        onClick={() => setCurrentView('demo')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          currentView === 'demo' 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Demo Site
      </button>
    </div>
  );

  // Render different views based on current selection
  if (currentView === 'demo') {
    return (
      <>
        {renderViewSwitcher()}
        <DemoWebsite />
      </>
    );
  }

  if (currentView === 'public') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        {renderViewSwitcher()}
        <PublicFeedbackView />
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <>
        {renderViewSwitcher()}
        <FeatureRequestDetail
          request={selectedRequest}
          onBack={() => setSelectedRequestId(null)}
          onAddComment={handleAddComment}
          onAddUpvote={handleAddUpvote}
          onUpdateStatus={handleUpdateStatus}
          onUpdateLabels={handleUpdateLabels}
          availableLabels={labels}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderViewSwitcher()}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <Header
            title={`Feature Requests (${filteredRequests.length})`}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No feature requests found.</p>
                </div>
              ) : (
                filteredRequests.map(request => (
                  <FeatureRequestCard
                    key={request.id}
                    request={request}
                    onClick={() => setSelectedRequestId(request.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          labels={labels}
        />
      </div>

      {/* Create Modal */}
      <CreateFeatureRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addFeatureRequest}
        labels={labels}
      />
    </div>
  );
}

export default App;