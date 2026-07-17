import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Podcast } from '@/lib/types';

export function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <Card className="card card-compact">
      <div className="card-header">
        <h2>{podcast.title}</h2>
        <p>{podcast.description || 'No description available.'}</p>
      </div>
      <div className="card-footer">
        <Link href={`/podcasts/${podcast.id}`} className="button button-secondary">
          View
        </Link>
      </div>
    </Card>
  );
}
