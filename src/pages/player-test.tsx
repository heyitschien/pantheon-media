import { MoviePlayer } from "@/components/player/MoviePlayer";
import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router-dom";

export default function PlayerTest() {
  const { closePlayer, currentVideo } = usePlayer();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<{
    videoUrl: string;
    posterUrl: string;
    title: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // First try to use the current video from context
      if (currentVideo) {
        console.log('Using current video from context:', currentVideo);
        setVideoData(currentVideo);
        return;
      }

      // Fallback to session storage
      const storedData = sessionStorage.getItem('playerData');
      if (!storedData) {
        console.log('No video data found in session storage');
        navigate('/');
        return;
      }

      console.log('Retrieved data from session storage:', storedData);
      const parsedData = JSON.parse(storedData);
      
      // Validate the data
      if (!parsedData.videoUrl || !parsedData.title) {
        throw new Error('Invalid video data: missing required fields');
      }

      // Validate video URL
      try {
        new URL(parsedData.videoUrl);
      } catch (e) {
        throw new Error('Invalid video URL format');
      }

      console.log('Setting video data:', parsedData);
      setVideoData(parsedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load video';
      console.error('Failed to load video data:', error);
      setError(errorMessage);
      setTimeout(() => navigate('/'), 2000);
    }
  }, [navigate, currentVideo]);

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!videoData) return null;

  return (
    <div className="min-h-screen w-screen bg-black">
      <MoviePlayer
        src={videoData.videoUrl}
        poster={videoData.posterUrl}
        title={videoData.title}
        onClose={closePlayer}
        className="h-screen w-screen"
      />
    </div>
  );
} 