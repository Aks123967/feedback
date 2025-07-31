import { FeatureRequest, Label } from '../types/feedback';

export const mockLabels: Label[] = [
  { id: '1', name: 'FIX', color: 'red' },
  { id: '2', name: 'ANNOUNCEMENT', color: 'blue' },
  { id: '3', name: 'IMPROVEMENT', color: 'green' },
  { id: '4', name: 'FEATURE', color: 'purple' },
  { id: '5', name: 'BUG', color: 'yellow' },
];

export const mockFeatureRequests: FeatureRequest[] = [
  {
    id: '1',
    title: 'gcjgv',
    summary: 'hkvkhv',
    status: 'public',
    labels: [mockLabels[0], mockLabels[1]], // FIX, ANNOUNCEMENT
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    author: 'Akshaya',
    upvotes: [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    ],
    comments: [
      {
        id: '1',
        content: 'This is a great idea! We should implement this soon.',
        author: 'Admin',
        isPublic: true,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      },
    ],
  },
];