'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { createEpisode } from '@/lib/episodes';
import { getPodcasts } from '@/lib/podcasts';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { PaginatedResponse, Podcast } from '@/lib/types';

const episodeSchema = z.object({
  podcastId: z.string().min(1, 'Podcast is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  publishedAt: z.string().optional(),
});

type EpisodeFormValues = z.infer<typeof episodeSchema>;

export default function NewEpisodePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<EpisodeFormValues>({ resolver: zodResolver(episodeSchema) });
  const podcastsQuery = useQuery<PaginatedResponse<Podcast>, Error>({
    queryKey: ['podcasts'],
    queryFn: () => getPodcasts({ page: 1, limit: 50, sort: 'newest' }),
  });

  async function onSubmit(values: EpisodeFormValues) {
    setError(null);
    try {
      const episode = await createEpisode(values);
      router.push(`/episodes/${episode.id}`);
    } catch (err) {
      setError((err as Error).message || 'Unable to create episode');
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <section className="card">
          <h1>New Episode</h1>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="podcastId">Podcast</FormLabel>
            {podcastsQuery.isLoading ? (
              <LoadingState message="Loading available podcasts..." />
            ) : podcastsQuery.isError ? (
              <ErrorState message={podcastsQuery.error?.message ?? 'Unable to load podcasts'} />
            ) : (
              <select id="podcastId" className="input" {...form.register('podcastId')}>
                <option value="">Select a podcast</option>
                {podcastsQuery.data?.data.map((podcast: Podcast) => (
                  <option key={podcast.id} value={podcast.id}>
                    {podcast.title}
                  </option>
                ))}
              </select>
            )}
            {form.formState.errors.podcastId && <p className="error-text">{form.formState.errors.podcastId.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="error-text">{form.formState.errors.title.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input id="description" {...form.register('description')} />
          </FormField>
          <FormField>
            <FormLabel htmlFor="publishedAt">Published At</FormLabel>
            <Input id="publishedAt" type="datetime-local" {...form.register('publishedAt')} />
          </FormField>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit">Create Episode</Button>
          </Form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
