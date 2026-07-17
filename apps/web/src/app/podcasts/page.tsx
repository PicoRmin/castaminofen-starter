'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getPodcasts } from '@/lib/podcasts';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card } from '@/components/ui/card';
import type { Podcast } from '@/lib/types';

export default function PodcastsPage() {
  const query = useQuery({
    queryKey: ['podcasts'],
    queryFn: () => getPodcasts({ page: 1, limit: 20, sort: 'newest' }),
  });

  if (query.isLoading) {
    return <LoadingState message="Loading podcasts..." />;
  }

  if (query.isError) {
    return <ErrorState message={query.error?.message ?? 'Unable to load podcasts'} />;
  }

  return (
    <main className="page-container">
      <section className="card">
        <div className="header">
          <h1>Podcasts</h1>
          <Link href="/podcasts/new" className="button button-primary">
            New Podcast
          </Link>
        </div>
        <div className="field-row">
          {query.data?.data.map((podcast: Podcast) => (
            <Card key={podcast.id} className="card">
              <h2>{podcast.title}</h2>
              <p>{podcast.description || 'No description provided.'}</p>
              <div className="toolbar">
                <Link href={`/podcasts/${podcast.id}`} className="button button-secondary">
                  View
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
