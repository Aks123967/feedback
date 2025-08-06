import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { FeatureRequest, Comment, Upvote, FilterState } from '../types/feedback';
import { mockFeatureRequests, mockLabels } from '../data/mockData';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'feedback-requests';
const API_KEYS_STORAGE_KEY = 'feedback-api-keys';

const loadFromStorage = (): FeatureRequest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
  return mockFeatureRequests;
};

const saveToStorage = (requests: FeatureRequest[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
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
    }
    
    return apiKeys[userId];
  } catch (error) {
    console.error('Error managing API keys:', error);
    return generateApiKey();
  }
};

export const useFeedbackData = () => {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(loadFromStorage);
  const [labels] = useState(mockLabels);

  // Save to localStorage whenever featureRequests changes
  useEffect(() => {
    saveToStorage(featureRequests);
  }, [featureRequests]);

  // Listen for storage changes from widget
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'feedback-requests' && e.newValue) {
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

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addFeatureRequest = useCallback((request: Omit<FeatureRequest, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    const newRequest: FeatureRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: [],
      comments: [],
    };
    setFeatureRequests(prev => [newRequest, ...prev]);
    toast.success('Feature request created successfully!');
    return newRequest;
  }, []);

  const updateFeatureRequest = useCallback((id: string, updates: Partial<FeatureRequest>) => {
    setFeatureRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, ...updates, updatedAt: new Date() }
        : req
    ));
    toast.success('Feature request updated successfully!');
  }, []);

  const deleteFeatureRequest = useCallback((id: string) => {
    setFeatureRequests(prev => prev.filter(req => req.id !== id));
    toast.success('Feature request deleted successfully!');
  }, []);

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
    // Only show toast in admin view, not in public view
    if (comment.author !== 'Anonymous User') {
      toast.success('Comment added successfully!');
    }
  }, []);

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
    // Only show toast in admin view, not in public view
    if (upvote.userName !== 'Anonymous User') {
      toast.success('Upvote added successfully!');
    }
  }, []);

  const removeUpvote = useCallback((requestId: string, userId: string) => {
    setFeatureRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, upvotes: req.upvotes.filter(upvote => upvote.userId !== userId) }
        : req
    ));
    toast.success('Upvote removed successfully!');
  }, []);

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
      }
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
  };
};