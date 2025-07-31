import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useFeedbackData } from '../hooks/useFeedbackData';
import { FeatureRequest, Comment } from '../types/feedback';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Badge } from './ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowLeftIcon, 
  HandThumbUpIcon, 
  ChatBubbleLeftIcon,
  PlusIcon,
  ArrowUturnLeftIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface FeatureRequestDetailProps {
  request: FeatureRequest;
  onBack: () => void;
  onAddComment: (content: string, isPublic: boolean) => void;
  onAddUpvote: () => void;
  onUpdateStatus: (status: FeatureRequest['status']) => void;
  onUpdateLabels: (labelIds: string[]) => void;
  availableLabels: Array<{ id: string; name: string; color: string }>;
}

export const FeatureRequestDetail: React.FC<FeatureRequestDetailProps> = ({
  request,
  onBack,
  onAddComment,
  onAddUpvote,
  onUpdateStatus,
  onUpdateLabels,
  availableLabels,
}) => {
  const { featureRequests } = useFeedbackData();
  const [newComment, setNewComment] = useState('');
  const [isCommentPublic, setIsCommentPublic] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'upvotes'>('comments');
  const [selectedLabels, setSelectedLabels] = useState<string[]>(request.labels.map(l => l.id));
  const [currentRequest, setCurrentRequest] = useState(request);

  // Update current request when featureRequests data changes
  React.useEffect(() => {
    const updatedRequest = featureRequests.find(req => req.id === request.id);
    if (updatedRequest) {
      setCurrentRequest(updatedRequest);
    }
  }, [featureRequests, request.id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment, isCommentPublic);
      setNewComment('');
    }
  };

  const handleLabelToggle = (labelId: string) => {
    const newLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter(id => id !== labelId)
      : [...selectedLabels, labelId];
    
    setSelectedLabels(newLabels);
  };

  const handleSaveLabels = () => {
    onUpdateLabels(selectedLabels);
    toast.success('Feature request updated successfully!');
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
        }}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to feature request
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
                Reply
              </Button>
              <Button variant="outline" size="sm">
                <DocumentIcon className="w-4 h-4 mr-2" />
                Generate Ticket
              </Button>
              <Button variant="ghost" size="sm">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Request Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentRequest.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <span>{formatDistanceToNow(currentRequest.createdAt, { addSuffix: true })}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>{currentRequest.comments.length} Comment{currentRequest.comments.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <HandThumbUpIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-xl font-bold text-gray-900">{currentRequest.upvotes.length}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700">{currentRequest.summary}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'comments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('comments')}
                  >
                    Comments
                  </button>
                  <button
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'upvotes'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('upvotes')}
                  >
                    Upvotes
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    {/* Add Comment Form */}
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <Textarea
                        placeholder="Leave a comment..."
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-700">Public</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCommentPublic}
                              onChange={(e) => setIsCommentPublic(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <Button type="submit" size="sm">
                          <ArrowUturnLeftIcon className="w-4 h-4 mr-2" />
                          Submit
                        </Button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {currentRequest.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{comment.author}</span>
                              {!comment.isPublic && (
                                <Badge variant="gray" size="sm">Private</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'upvotes' && (
                  <div className="space-y-4">
                    <Button variant="outline" size="sm" onClick={onAddUpvote}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add upvote
                    </Button>
                    
                    <div className="space-y-3">
                      {currentRequest.upvotes.map(upvote => (
                        <div key={upvote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{upvote.userName}</span>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(upvote.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Recommender</h3>
          <p className="text-gray-700">{currentRequest.author}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
          <div className="space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="public"
                checked={currentRequest.status === 'public'}
                onChange={(e) => onUpdateStatus(e.target.value as FeatureRequest['status'])}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                currentRequest.status === 'public' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {currentRequest.status === 'public' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Public</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="internal"
                checked={currentRequest.status === 'internal'}
                onChange={(e) => onUpdateStatus(e.target.value as FeatureRequest['status'])}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                currentRequest.status === 'internal' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {currentRequest.status === 'internal' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Internal</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Labels</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[60px]">
              {selectedLabels.map(labelId => {
                const label = availableLabels.find(l => l.id === labelId);
                return label ? (
                  <div key={labelId} className="flex items-center">
                    <Badge variant={label.color as any} size="sm">
                      {label.name}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleLabelToggle(labelId)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
            
            <div className="space-y-2">
              {availableLabels
                .filter(label => !selectedLabels.includes(label.id))
                .map(label => (
                  <button
                    key={label.id}
                    onClick={() => handleLabelToggle(label.id)}
                    className="flex items-center w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <Badge variant={label.color as any} size="sm">
                      {label.name}
                    </Badge>
                  </button>
                ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Segment
            </Button>
          </div>
        </div>

        <Button type="button" onClick={handleSaveLabels} className="w-full">
          <CheckIcon className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};