import { Play, Pause } from 'lucide-react';
import { useState, useRef } from 'react';

export function AudioPlayer({ audioUrl, title }: { audioUrl: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="audio-player-card">
      <div className="audio-player-meta">
        <span>{title}</span>
        <button type="button" className="button button-secondary" onClick={handleToggle}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <audio ref={audioRef} src={audioUrl} className="audio-player" controls onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    </section>
  );
}
