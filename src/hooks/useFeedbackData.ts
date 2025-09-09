import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { FeatureRequest, Comment, Upvote, FilterState } from '../types/feedback';
import { mockFeatureRequests, mockLabels } from '../data/mockData';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'feedback-requests';
const API_KEYS_STORAGE_KEY = 'feedback-api-keys';
const API_DATA_STORAGE_KEY = 'feedback-api-data';

const loadFromStorage = (apiKey?: string): FeatureRequest[] => {
  try {
    let stored;
    if (apiKey) {
      // Load data specific to this API key
      const apiData = localStorage.getItem(API_DATA_STORAGE_KEY);
      const allApiData = apiData ? JSON.parse(apiData) : {};
      stored = JSON.stringify(allApiData[apiKey] || []);
    } else {
      // Load global data (for admin view)
      stored = localStorage.getItem(STORAGE_KEY);
    }
    
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((req: any) => ({
        ...req,
        createdAt: new Date(req.createdAt),
        updatedAt: new Date(req.updatedAt),
        upvotes: req.upvotes.map((upvote: any) => ({
          ...upvote,
          createdAt: new Date(upvote.createdAt),
        })),
        comments: req.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        })),
      }));
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return apiKey ? [] : mockFeatureRequests;
};

const saveToStorage = (requests: FeatureRequest[], apiKey?: string) => {
  try {
    if (apiKey) {
      // Save data specific to this API key
      const apiData = localStorage.getItem(API_DATA_STORAGE_KEY);
      const allApiData = apiData ? JSON.parse(apiData) : {};
      allApiData[apiKey] = requests;
      localStorage.setItem(API_DATA_STORAGE_KEY, JSON.stringify(allApiData));
      
      // Also trigger storage event for this specific API key
      const storageEvent = new StorageEvent('storage', {
        key: `${API_DATA_STORAGE_KEY}-${apiKey}`,
        newValue: JSON.stringify(requests),
        storageArea: localStorage,
        url: window.location.href
      });
      window.dispatchEvent(storageEvent);
    } else {
      // Save global data (for admin view)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const generateApiKey = (): string => {
  return 'fdk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getOrCreateApiKey = (userId: string): string => {
  try {
    const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
    const apiKeys = stored ? JSON.parse(stored) : {};
    
    if (!apiKeys[userId]) {
      apiKeys[userId] = generateApiKey();
      localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
      
      // Initialize empty data for this new API key
      const apiData = localStorage.getItem(API_DATA_STORAGE_KEY);
      const allApiData = apiData ? JSON.parse(apiData) : {};
      allApiData[apiKeys[userId]] = [];
      localStorage.setItem(API_DATA_STORAGE_KEY, JSON.stringify(allApiData));
    }
    
    return apiKeys[userId];
  } catch (error) {
    console.error('Error managing API keys:', error);
    return generateApiKey();
  }
};

// Get data for a specific API key
const getApiKeyData = (apiKey: string): FeatureRequest[] => {
  return loadFromStorage(apiKey);
};

// Save data for a specific API key
const saveApiKeyData = (apiKey: string, requests: FeatureRequest[]) => {
  saveToStorage(requests, apiKey);
};
export const useFeedbackData = (apiKey?: string) => {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(loadFromStorage(apiKey));
  const [labels] = useState(mockLabels);

  // Save to localStorage whenever featureRequests changes
  useEffect(() => {
    saveToStorage(featureRequests, apiKey);
  }, [featureRequests, apiKey]);

  // Listen for storage changes from widget
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const targetKey = apiKey ? `${API_DATA_STORAGE_KEY}-${apiKey}` : STORAGE_KEY;
      if (e.key === targetKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const converted = parsed.map((req: any) => ({
            ...req,
            createdAt: new Date(req.createdAt),
            updatedAt: new Date(req.updatedAt),
            upvotes: req.upvotes.map((upvote: any) => ({
              ...upvote,
              createdAt: new Date(upvote.createdAt),
            })),
            comments: req.comments.map((comment: any) => ({
              ...comment,
              createdAt: new Date(comment.createdAt),
            })),
          }));
          setFeatureRequests(converted);
        } catch (error) {
          console.error('Error parsing storage update:', error);
        }
      }
    };

    const handleCustomFeedbackUpdate = () => {
      // Reload data when custom event is triggered
      const reloaded = loadFromStorage(apiKey);
      setFeatureRequests(reloaded);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('feedbackDataUpdated', handleCustomFeedbackUpdate);
    
    // Listen for API key specific events
    if (apiKey) {
      window.addEventListener(`feedbackDataUpdated-${apiKey}`, handleCustomFeedbackUpdate);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('feedbackDataUpdated', handleCustomFeedbackUpdate);
      if (apiKey) {
        window.removeEventListener(`feedbackDataUpdated-${apiKey}`, handleCustomFeedbackUpdate);
      }
    };
  }, [apiKey]);

  const addFeatureRequest = useCallback((request: Omit<FeatureRequest, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    console.log('Adding feature request:', request);
    
    const newRequest: FeatureRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: [],
      comments: [],
    };
    
    console.log('New request created:', newRequest);
    
    setFeatureRequests(prev => [newRequest, ...prev]);
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    // Don't show toast here as it's handled in the components
    return newRequest;
  }, [apiKey]);

  const updateFeatureRequest = useCallback((id: string, updates: Partial<FeatureRequest>) => {
    setFeatureRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, ...updates, updatedAt: new Date() }
        : req
    ));
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    toast.success('Feature request updated successfully!');
  }, [apiKey]);

  const deleteFeatureRequest = useCallback((id: string) => {
    setFeatureRequests(prev => prev.filter(req => req.id !== id));
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    toast.success('Feature request deleted successfully!');
  }, [apiKey]);

  const addComment = useCallback((requestId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setFeatureRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, comments: [...req.comments, newComment], updatedAt: new Date() }
        : req
    ));
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    // Only show toast in admin view, not in public view
    if (comment.author !== 'Anonymous User') {
      toast.success('Comment added successfully!');
    }
  }, [apiKey]);

  const addUpvote = useCallback((requestId: string, upvote: Omit<Upvote, 'id' | 'createdAt'>) => {
    const newUpvote: Upvote = {
      ...upvote,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setFeatureRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, upvotes: [...req.upvotes, newUpvote], updatedAt: new Date() }
        : req
    ));
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    // Only show toast in admin view, not in public view
    if (upvote.userName !== 'Anonymous User') {
      toast.success('Upvote added successfully!');
    }
  }, [apiKey]);

  const removeUpvote = useCallback((requestId: string, userId: string) => {
    setFeatureRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, upvotes: req.upvotes.filter(upvote => upvote.userId !== userId) }
        : req
    ));
    
    // Trigger custom event for widgets
    window.dispatchEvent(new CustomEvent('feedbackDataUpdated'));
    if (apiKey) {
      window.dispatchEvent(new CustomEvent(`feedbackDataUpdated-${apiKey}`));
    }
    
    toast.success('Upvote removed successfully!');
  }, [apiKey]);

  const filterRequests = useCallback((requests: FeatureRequest[], filters: FilterState) => {
    let filtered = [...requests];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchLower) ||
        req.summary.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(req => filters.status.includes(req.status));
    }

    // Labels filter
    if (filters.labels.length > 0) {
      filtered = filtered.filter(req => 
        req.labels.some(label => filters.labels.includes(label.id))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'most-upvotes':
          return b.upvotes.length - a.upvotes.length;
        case 'least-upvotes':
          return a.upvotes.length - b.upvotes.length;
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      const updated = [newRequest, ...prev];
      console.log('Updated requests:', updated);
      return updated;
    });

    return filtered;
  }, []);

  return {
    featureRequests,
    labels,
    addFeatureRequest,
    updateFeatureRequest,
    deleteFeatureRequest,
    addComment,
    addUpvote,
    removeUpvote,
    filterRequests,
    getOrCreateApiKey,
    getApiKeyData,
    saveApiKeyData,
  };
};