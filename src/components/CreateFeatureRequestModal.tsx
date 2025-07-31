import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Badge } from './ui/Badge';
import { FeatureRequest, Label } from '../types/feedback';
import { CheckIcon } from '@heroicons/react/24/outline';

interface CreateFeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<FeatureRequest, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => void;
  labels: Label[];
}

export const CreateFeatureRequestModal: React.FC<CreateFeatureRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  labels,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    status: 'public' as 'public' | 'internal',
    author: 'Admin',
    selectedLabels: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.summary.trim()) {
      toast.error('Please enter a summary');
      return;
    }
    
    const selectedLabelObjects = labels.filter(label => 
      formData.selectedLabels.includes(label.id)
    );

    onSubmit({
      title: formData.title,
      summary: formData.summary,
      status: formData.status,
      author: formData.author,
      labels: selectedLabelObjects,
    });

    // Reset form
    setFormData({
      title: '',
      summary: '',
      status: 'public',
      author: 'Admin',
      selectedLabels: [],
    });
    
    onClose();
  };

  const toggleLabel = (labelId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLabels: prev.selectedLabels.includes(labelId)
        ? prev.selectedLabels.filter(id => id !== labelId)
        : [...prev.selectedLabels, labelId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Feature Request" maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          placeholder="Enter request title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <Textarea
          label="Summary"
          placeholder="Describe the feature request in detail"
          rows={4}
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
          <div className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
            <span className="text-2xl">🇺🇸</span>
            <span className="font-medium">EN</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="public"
                checked={formData.status === 'public'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'public' | 'internal' }))}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                formData.status === 'public' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {formData.status === 'public' && (
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
                checked={formData.status === 'internal'}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'public' | 'internal' }))}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                formData.status === 'internal' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {formData.status === 'internal' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Internal</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Labels</label>
          <div className="space-y-2">
            {labels.map(label => (
              <label key={label.id} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.selectedLabels.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                    formData.selectedLabels.includes(label.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.selectedLabels.includes(label.id) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <Badge variant={label.color}>{label.name}</Badge>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <CheckIcon className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};