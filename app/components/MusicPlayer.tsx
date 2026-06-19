'use client';

import { useState, useRef, useEffect } from 'react';
import { mp3 } from '@/data/song';

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = mp3[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentSongIndex < mp3.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, currentSong.url]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSongIndex < mp3.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickX = e.clientX - progressBar.getBoundingClientRect().left;
    const percentage = clickX / progressBar.offsetWidth;
    const newTime = percentage * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black p-6">
      <audio ref={audioRef} />
      
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-2xl p-8">
        {/* Current Song Display */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg h-48 flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-24 h-24 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.15l-16 10a1 1 0 000 1.696l16 10A1 1 0 0018 17V3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">{currentSong.name}</h2>
          <p className="text-purple-300 text-sm mt-2">
            Song {currentSongIndex + 1} of {mp3.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            onClick={handleProgressClick}
            className="w-full h-2 bg-gray-700 rounded-full cursor-pointer hover:h-3 transition-all"
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentSongIndex === 0}
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
            </svg>
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 1.5A.75.75 0 005 2.25v15.5a.75.75 0 001.5 0V2.25A.75.75 0 005.75 1.5zm8.5 0a.75.75 0 00-.75.75v15.5a.75.75 0 001.5 0V2.25a.75.75 0 00-.75-.75z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.5 2.5A1.5 1.5 0 014 1h12a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5H4a1.5 1.5 0 01-1.5-1.5v-15zm7 1a1 1 0 10-2 0v9.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L9.5 12.586V3.5z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentSongIndex === mp3.length - 1}
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </button>
        </div>

        {/* Playlist */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Playlist</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mp3.map((song, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setIsPlaying(true);
                }}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  index === currentSongIndex
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold w-6 text-center">
                    {index + 1}
                  </span>
                  <span className="flex-1">{song.name}</span>
                  {index === currentSongIndex && isPlaying && (
                    <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.15l-16 10a1 1 0 000 1.696l16 10A1 1 0 0018 17V3z"></path>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
