export interface AppHealthResponse {
  status: 'ok';
  service: 'web' | 'api';
}

export interface CreatePodcastDraft {
  title: string;
  rssUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Podcast {
  id: string;
  title: string;
  rssUrl: string;
  description?: string;
  website?: string;
  artworkUrl?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description?: string;
  audioUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
