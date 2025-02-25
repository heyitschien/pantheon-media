import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PlayerContextType {
  playMovie: (props: {
    videoUrl: string;
    posterUrl: string;
    title: string;
  }) => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const playMovie = ({ videoUrl, posterUrl, title }: {
    videoUrl: string;
    posterUrl: string;
    title: string;
  }) => {
    // Store the video info in sessionStorage
    sessionStorage.setItem('playerData', JSON.stringify({
      videoUrl,
      posterUrl,
      title
    }));
    navigate('/player-test');
  };

  const closePlayer = () => {
    sessionStorage.removeItem('playerData');
    navigate(-1);
  };

  return (
    <PlayerContext.Provider value={{ playMovie, closePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
} 