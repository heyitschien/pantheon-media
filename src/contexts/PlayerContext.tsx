import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface PlayerContextType {
  playMovie: (props: {
    videoUrl: string;
    posterUrl: string;
    title: string;
  }) => void;
  closePlayer: () => void;
  isPlaying: boolean;
  currentVideo: {
    videoUrl: string;
    posterUrl: string;
    title: string;
  } | null;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    videoUrl: string;
    posterUrl: string;
    title: string;
  } | null>(null);

  const playMovie = ({ videoUrl, posterUrl, title }: {
    videoUrl: string;
    posterUrl: string;
    title: string;
  }) => {
    try {
      // Validate and ensure HTTPS for video URL
      const videoUrlObj = new URL(videoUrl);
      if (!videoUrlObj.protocol.startsWith('http')) {
        throw new Error('Invalid video URL');
      }
      // Force HTTPS
      videoUrlObj.protocol = 'https:';
      
      // Validate and ensure HTTPS for poster URL if it exists
      let posterUrlObj;
      if (posterUrl) {
        posterUrlObj = new URL(posterUrl);
        posterUrlObj.protocol = 'https:';
      }

      console.log('Playing movie:', {
        videoUrl: videoUrlObj.toString(),
        posterUrl: posterUrlObj?.toString(),
        title
      });

      // Store the video info in sessionStorage with corrected URLs
      const videoData = {
        videoUrl: videoUrlObj.toString(),
        posterUrl: posterUrlObj?.toString() || '',
        title
      };
      
      sessionStorage.setItem('playerData', JSON.stringify(videoData));
      setCurrentVideo(videoData);
      setIsPlaying(true);
      navigate('/player-test');
    } catch (error) {
      console.error('Failed to play video:', error);
      // You might want to show a toast or error message here
    }
  };

  const closePlayer = () => {
    sessionStorage.removeItem('playerData');
    setCurrentVideo(null);
    setIsPlaying(false);
    navigate(-1);
  };

  return (
    <PlayerContext.Provider value={{ 
      playMovie, 
      closePlayer,
      isPlaying,
      currentVideo
    }}>
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