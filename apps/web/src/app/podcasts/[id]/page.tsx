'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPodcastById } from '@/lib/podcasts';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import type { Episode } from '@/lib/types';

export default function PodcastDetailsPage() {
  const params = useParams();
  const podcastId = params?.id as string;
  const query = useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: () => getPodcastById(podcastId),
    enabled: Boolean(podcastId),
  });

  if (query.isLoading) {
    return <LoadingState message="Loading podcast details..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Podcast not found'} />;
  }

  return (
    <main className="page-container">
      <section className="card">
        <div className="header">
          <div>
            <h1>{query.data.title}</h1>
            <p>{query.data.description || 'No description available.'}</p>
          </div>
          <div className="toolbar">
            <Link href={`/podcasts/${podcastId}/edit`} className="button button-secondary">
              Edit
            </Link>
          </div>
        </div>
        <div className="field-row">
          <Card>
            <p>
              <strong>RSS URL:</strong> {query.data.rssUrl}
            </p>
            <p>
              <strong>Website:</strong> {query.data.website || '—'}
            </p>
          </Card>
          <Card>
            <h2>Episodes</h2>
            {query.data.episodes?.length ? (
              <div className="field-row">
                {query.data.episodes.map((episode: Episode) => (
                  <Card key={episode.id} className="card">
                    <h3>{episode.title}</h3>
                    <p>{episode.description || 'No description'}</p>
                    <Link href={`/episodes/${episode.id}`} className="button button-secondary">
                      View Episode
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No episodes found.</p>
            )}
          </Card>
        </div>
      </section>
    </main>
  );
}
