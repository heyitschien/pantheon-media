import { MoviePlayer } from "@/components/player/MoviePlayer";
import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router-dom";

export default function PlayerTest() {
  const { closePlayer } = usePlayer();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<{
    videoUrl: string;
    posterUrl: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('playerData');
    if (!storedData) {
      navigate('/');
      return;
    }
    setVideoData(JSON.parse(storedData));
  }, [navigate]);

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