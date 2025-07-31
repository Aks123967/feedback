import React from 'react';
import { FilterState, Label } from '../types/feedback';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Badge } from './ui/Badge';
import { CheckIcon } from '@heroicons/react/24/outline';

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  labels: Label[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  labels,
}) => {
  const statusOptions = [
    { value: 'public', label: 'Public', count: 1 },
    { value: 'internal', label: 'Internal', count: 0 },
    { value: 'archived', label: 'Archived', count: 0 },
    { value: 'pending', label: 'Pending Approval', count: 0 },
  ];

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const toggleLabel = (labelId: string) => {
    const newLabels = filters.labels.includes(labelId)
      ? filters.labels.filter(l => l !== labelId)
      : [...filters.labels, labelId];
    
    onFiltersChange({ ...filters, labels: newLabels });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
        <Input
          placeholder="Search requests..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div>
        <Select
          label=""
          options={[
            { value: 'newest', label: 'Most Upvotes' },
            { value: 'oldest', label: 'Least Upvotes' },
            { value: 'most-upvotes', label: 'Newest' },
            { value: 'least-upvotes', label: 'Oldest' },
          ]}
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Date Range</h3>
        <Input
          type="date"
          placeholder="Select Date"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
        <div className="space-y-3">
          {statusOptions.map(option => (
            <label key={option.value} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={() => toggleStatus(option.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                  filters.status.includes(option.value)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {filters.status.includes(option.value) && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-sm text-gray-500">({option.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Labels</h3>
        <Select
          options={[{ value: '', label: 'Select' }, ...labels.map(label => ({ value: label.id, label: label.name }))]}
          value=""
          onChange={(e) => {
            if (e.target.value) {
              toggleLabel(e.target.value);
            }
          }}
        />
        {filters.labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.labels.map(labelId => {
              const label = labels.find(l => l.id === labelId);
              return label ? (
                <Badge key={labelId} variant={label.color} size="sm">
                  {label.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};