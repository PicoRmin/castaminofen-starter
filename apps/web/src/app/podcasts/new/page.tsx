'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPodcast } from '@/lib/podcasts';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const podcastSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  rssUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional(),
  artworkUrl: z.string().url('Must be a valid URL').optional(),
});

type PodcastFormValues = z.infer<typeof podcastSchema>;

export default function NewPodcastPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<PodcastFormValues>({ resolver: zodResolver(podcastSchema) });

  async function onSubmit(values: PodcastFormValues) {
    setError(null);
    try {
      const podcast = await createPodcast(values);
      router.push(`/podcasts/${podcast.id}`);
    } catch (err) {
      setError((err as Error).message || 'Unable to create podcast');
    }
  }

  return (
    <ProtectedRoute>
      <main className="page-container">
        <section className="card">
          <h1>New Podcast</h1>
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
          </FormField>
          <FormField>
            <FormLabel htmlFor="artworkUrl">Artwork URL</FormLabel>
            <Input id="artworkUrl" {...form.register('artworkUrl')} />
          </FormField>
          {error && <p className="error-text">{error}</p>}
          <Button type="submit">Create Podcast</Button>
          </Form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
