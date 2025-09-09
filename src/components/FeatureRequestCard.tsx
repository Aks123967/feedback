import React from 'react';
import { FeatureRequest } from '../types/feedback';
import { Badge } from './ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon, HandThumbUpIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface FeatureRequestCardProps {
  request: FeatureRequest;
  onClick: () => void;
}

export const FeatureRequestCard: React.FC<FeatureRequestCardProps> = ({
  request,
  onClick,
}) => {
  return (
    <div
      className="card cursor-pointer scale-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text mb-2">{request.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.summary}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              {request.status === 'public' ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <LockClosedIcon className="w-4 h-4" />
              )}
              <span className="capitalize">{request.status}</span>
            </div>
            <span>•</span>
            <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>{request.comments.length} Comment{request.comments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {request.labels.map(label => (
                <Badge key={label.id} variant={label.color} size="sm">
                  {label.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <HandThumbUpIcon className="w-4 h-4" />
              <span className="text-lg font-semibold">{request.upvotes.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};