export interface FeatureRequest {
  id: string;
  title: string;
  summary: string;
  status: 'public' | 'internal' | 'archived' | 'pending';
  labels: Label[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
  upvotes: Upvote[];
  comments: Comment[];
}

export interface Label {
  id: string;
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
}

export interface Upvote {
  id: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface FilterState {
  search: string;
  status: string[];
  labels: string[];
  sortBy: 'newest' | 'oldest' | 'most-upvotes' | 'least-upvotes';
  dateRange?: {
    start: Date;
    end: Date;
  };
}