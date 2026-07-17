'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getPodcastById } from '@/lib/podcasts';
import { updatePodcast } from '@/lib/podcasts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const podcastSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  rssUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional(),
  artworkUrl: z.string().url('Must be a valid URL').optional(),
});

type PodcastFormValues = z.infer<typeof podcastSchema>;

export default function EditPodcastPage() {
  const params = useParams();
  const podcastId = params?.id as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: () => getPodcastById(podcastId),
    enabled: Boolean(podcastId),
  });
  const form = useForm<PodcastFormValues>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      title: '',
      rssUrl: '',
      description: '',
      website: '',
      artworkUrl: '',
    },
  });

  useEffect(() => {
    if (query.data) {
      form.reset({
        title: query.data.title,
        rssUrl: query.data.rssUrl,
        description: query.data.description ?? '',
        website: query.data.website ?? '',
        artworkUrl: query.data.artworkUrl ?? '',
      });
    }
  }, [query.data, form]);

  async function onSubmit(values: PodcastFormValues) {
    setError(null);
    try {
      await updatePodcast(podcastId, values);
      router.push(`/podcasts/${podcastId}`);
    } catch (err) {
      setError((err as Error).message || 'Unable to update podcast');
    }
  }

  if (query.isLoading) {
    return <LoadingState message="Loading podcast..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Podcast not found'} />;
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <section className="card">
          <h1>Edit Podcast</h1>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="error-text">{form.formState.errors.title.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="rssUrl">RSS URL</FormLabel>
            <Input id="rssUrl" {...form.register('rssUrl')} />
            {form.formState.errors.rssUrl && <p className="error-text">{form.formState.errors.rssUrl.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Input id="description" {...form.register('description')} />
          </FormField>
          <FormField>
            <FormLabel htmlFor="website">Website</FormLabel>
            <Input id="website" {...form.register('website')} />
            {form.formState.errors.website && <p className="error-text">{form.formState.errors.website.message}</p>}
          </FormField>
          <FormField>
            <FormLabel htmlFor="artworkUrl">Artwork URL</FormLabel>
            <Input id="artworkUrl" {...form.register('artworkUrl')} />
            {form.formState.errors.artworkUrl && <p className="error-text">{form.formState.errors.artworkUrl.message}</p>}
          </FormField>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit">Save Changes</Button>
          </Form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
