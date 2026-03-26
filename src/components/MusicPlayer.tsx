import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f2ff"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "CodeWave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#bc13fe"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-glitch-black/80 p-6 glitch-border">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-6">
        <motion.div 
          animate={{ 
            rotate: isPlaying ? [0, 5, -5, 0] : 0,
            x: isPlaying ? [0, 2, -2, 0] : 0,
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.1,
            ease: "linear"
          }}
          className="w-20 h-20 bg-glitch-magenta flex items-center justify-center glitch-border"
        >
          <Music className="text-black w-10 h-10" />
        </motion.div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-glitch-cyan truncate uppercase tracking-tighter">{currentTrack.title}</h3>
          <p className="text-glitch-magenta text-xs uppercase opacity-70 tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Progress Bar */}
        <div className="h-4 w-full bg-white/5 border border-white/10 relative overflow-hidden">
          <motion.div 
            className="h-full bg-glitch-cyan"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white/50 font-mono pointer-events-none">
            BUFFERING_SIGNAL... {Math.round(progress)}%
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="p-3 text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all border border-glitch-cyan/20"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-glitch-magenta text-black hover:bg-glitch-cyan transition-all glitch-border"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all border border-glitch-cyan/20"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-white/20 text-[8px] uppercase tracking-[0.2em]">
          <span>VOL_01</span>
          <div className="h-1 flex-1 bg-white/5 border border-white/10">
            <div className="h-full w-2/3 bg-glitch-magenta/30" />
          </div>
          <span>MAX_GAIN</span>
        </div>
      </div>
    </div>
  );
};
