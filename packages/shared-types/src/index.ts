export interface AppHealthResponse {
  status: 'ok';
  service: 'web' | 'api';
}

export interface CreatePodcastDraft {
  title: string;
  rssUrl: string;
}
