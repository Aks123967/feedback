import React, { useState, useMemo } from 'react';
import { FeatureRequest } from '../types/feedback';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Badge } from './ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronUpIcon, 
  ChatBubbleLeftIcon, 
  PlusIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { useFeedbackData } from '../hooks/useFeedbackData';

interface PublicFeedbackViewProps {
  isWidget?: boolean;
  apiKey?: string;
}

export const PublicFeedbackView: React.FC<PublicFeedbackViewProps> = ({ isWidget = false, apiKey }) => {
  const { featureRequests, labels, addFeatureRequest, addUpvote, addComment } = useFeedbackData(apiKey);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedLabelId: '',
  });

  // Update selected request when featureRequests change
  React.useEffect(() => {
    if (selectedRequest) {
      const updatedRequest = featureRequests.find(req => req.id === selectedRequest.id);
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
      }
    }
  }, [featureRequests, selectedRequest]);

  // Filter only public requests
  const publicRequests = useMemo(() => {
    return featureRequests
      .filter(req => req.status === 'public')
      .filter(req => 
        searchTerm === '' || 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.upvotes.length - a.upvotes.length);
  }, [featureRequests, searchTerm, apiKey]);

  const handleUpvote = (requestId: string) => {
    const userId = `user-${Date.now()}`;
    addUpvote(requestId, {
      userId,
      userName: 'Anonymous User',
    });
  };

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    const selectedLabel = formData.selectedLabelId 
      ? labels.find(label => label.id === formData.selectedLabelId)
      : null;
    
    const newRequest = addFeatureRequest({
      title: formData.title,
      summary: formData.description,
      status: 'public',
      author: 'Anonymous User',
      labels: selectedLabel ? [selectedLabel] : [],
    });

    // Show success message
    alert('Thank you for your feedback!');

    setFormData({ title: '', description: '', selectedLabelId: '' });
    setShowCreateForm(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedRequest) return;

    addComment(selectedRequest.id, {
      content: newComment,
      author: 'Anonymous User',
      isPublic: true,
    });

    setNewComment('');
  };

  if (showCreateForm) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-4">Share Idea</h2>
        
        <form onSubmit={handleSubmitIdea} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe your Idea"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.selectedLabelId}
              onChange={(e) => setFormData(prev => ({ ...prev, selectedLabelId: e.target.value }))}
            >
              <option value="">Select Category (Optional)</option>
              {labels.map(label => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedRequest) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Ideas
          </Button>
        </div>

        <div className="flex items-start space-x-3 mb-4">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleUpvote(selectedRequest.id)}
              className="flex flex-col items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronUpIcon className="w-4 h-4 text-gray-600" />
              <span className="text-lg font-bold text-gray-900">{selectedRequest.upvotes.length}</span>
            </button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 mb-2">{selectedRequest.title}</h1>
            <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
              <span>{formatDistanceToNow(selectedRequest.createdAt, { addSuffix: true })}</span>
              <div className="flex items-center space-x-1">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                <span>{selectedRequest.comments.length} Comment{selectedRequest.comments.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3">{selectedRequest.summary}</p>
            
            {selectedRequest.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedRequest.labels.map(label => (
                  <Badge key={label.id} variant={label.color as any} size="sm">
                    {label.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Comments</h3>
          
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Leave a comment"
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button type="submit" size="sm" className="self-end">
                <PaperAirplaneIcon className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {selectedRequest.comments.filter(comment => comment.isPublic).map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Idea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 text-sm"
        />
        <Button onClick={() => setShowCreateForm(true)} size="sm">
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {publicRequests.map(request => (
          <div
            key={request.id}
            className="flex items-start space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 scale-in"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex flex-col items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpvote(request.id);
                }}
                className="flex flex-col items-center p-1.5 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-300 hover:scale-105"
              >
                <ChevronUpIcon className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">{request.upvotes.length}</span>
              </button>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text mb-1 text-sm">{request.title}</h3>
              <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="w-3 h-3" />
                  <span>{request.comments.filter(c => c.isPublic).length} Comment{request.comments.filter(c => c.isPublic).length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs line-clamp-2 mb-2">{request.summary}</p>
              
              {request.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {request.labels.map(label => (
                    <Badge key={label.id} variant={label.color as any} size="sm">
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {publicRequests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            {apiKey ? 'No ideas yet. Be the first to share one!' : 'No feature requests found.'}
          </p>
        </div>
      )}

    </div>
  );
};