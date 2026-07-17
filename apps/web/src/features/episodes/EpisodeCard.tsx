import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { Episode } from '@/lib/types';

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Card className="card card-compact">
      <div className="card-header">
        <h3>{episode.title}</h3>
        <p>{episode.description || 'No description provided.'}</p>
      </div>
      <div className="card-footer">
        <Link href={`/episodes/${episode.id}`} className="button button-secondary">
          View Episode
        </Link>
      </div>
    </Card>
  );
}
