'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getEpisodeById, uploadEpisodeAudio } from '@/lib/episodes';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EpisodeDetailsPage() {
  const params = useParams();
  const episodeId = params?.id as string;
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const query = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: Boolean(episodeId),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadEpisodeAudio(episodeId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['episode', episodeId] });
    },
  });

  if (query.isLoading) {
    return <LoadingState message="Loading episode..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message ?? 'Episode not found'} />;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadMutation.mutateAsync(selectedFile);
    setSelectedFile(null);
  };

  return (
    <ProtectedRoute>
      <main className="page-container">
        <section className="card">
        <div className="header">
          <div>
            <h1>{query.data.title}</h1>
            <p>{query.data.description || 'No description available.'}</p>
          </div>
        </div>
        <div className="field-row">
          <Card>
            <p>
              <strong>Podcast ID:</strong> {query.data.podcastId}
            </p>
            <p>
              <strong>Published At:</strong> {query.data.publishedAt || 'Draft'}
            </p>
            <p>
              <strong>Audio URL:</strong> {query.data.audioUrl || 'Not uploaded'}
            </p>
            {query.data.audioUrl ? (
              <audio className="audio-player" controls src={query.data.audioUrl} />
            ) : (
              <p className="form-message">Audio is not available yet.</p>
            )}
          </Card>
          <Card>
            <h2>Upload Audio</h2>
            <div className="form-field">
              <label htmlFor="audioFile" className="form-label">
                Select audio file
              </label>
              <input
                id="audioFile"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="input"
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Audio'}
              </Button>
              {uploadMutation.isError && <p className="error-text">{uploadMutation.error?.message ?? 'Upload failed'}</p>}
              {uploadMutation.isSuccess && <p className="form-message">Audio uploaded successfully.</p>}
            </div>
          </Card>
        </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
