import { Play, Plus, ThumbsUp, Info, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieControlButtonProps {
  onClick: (event: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary";
  isActive?: boolean;
  feedback?: string;
  showFeedback?: boolean;
  className?: string;
}

export function MovieControlButton({
  onClick,
  icon,
  label,
  variant = "secondary",
  isActive,
  feedback,
  showFeedback,
  className
}: MovieControlButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={cn(
          "rounded-full p-3 transition-all duration-200 shadow-md",
          variant === "primary" ? 
            "bg-white text-black hover:bg-white/90" : 
            "bg-zinc-800/90 hover:bg-zinc-700/90 ring-1 ring-white/20",
          isActive && "bg-zinc-700/90 ring-2 ring-white/30",
          className
        )}
        aria-label={label}
      >
        {icon}
      </button>
      {showFeedback && feedback && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-md text-white text-xs whitespace-nowrap
          animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-lg"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

export function PlayButton({ onClick, showText = false }: { onClick: (event: React.MouseEvent) => void, showText?: boolean }) {
  return showText ? (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-8 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
    >
      <Play className="w-5 h-5" />
      <span>Play</span>
    </button>
  ) : (
    <MovieControlButton
      onClick={onClick}
      icon={<Play className="w-6 h-6" />}
      label="Play"
      variant="primary"
    />
  );
}

export function AddToListButton({ onClick, isActive, showFeedback }: { onClick: (event: React.MouseEvent) => void, isActive?: boolean, showFeedback?: boolean }) {
  return (
    <MovieControlButton
      onClick={onClick}
      icon={<Plus className={cn(
        "w-6 h-6 text-white transition-transform duration-200",
        isActive && "rotate-90"
      )} />}
      label="Add to List"
      isActive={isActive}
      feedback="Added to List"
      showFeedback={showFeedback}
    />
  );
}

export function LikeButton({ onClick, isActive, showFeedback }: { onClick: (event: React.MouseEvent) => void, isActive?: boolean, showFeedback?: boolean }) {
  return (
    <MovieControlButton
      onClick={onClick}
      icon={<ThumbsUp className={cn(
        "w-6 h-6 text-white transition-transform duration-200",
        isActive && "scale-110"
      )} />}
      label="Like"
      isActive={isActive}
      feedback="Added to Liked"
      showFeedback={showFeedback}
    />
  );
}

export function InfoButton({ onClick }: { onClick: (event: React.MouseEvent) => void }) {
  return (
    <MovieControlButton
      onClick={onClick}
      icon={<Info className="w-6 h-6 text-white" />}
      label="More Info"
    />
  );
}

export function VolumeButton({ onClick, isMuted, showFeedback }: { onClick: (event: React.MouseEvent) => void, isMuted: boolean, showFeedback?: boolean }) {
  return (
    <MovieControlButton
      onClick={onClick}
      icon={isMuted ? 
        <VolumeX className="w-6 h-6 text-white" /> : 
        <Volume2 className="w-6 h-6 text-white" />
      }
      label={isMuted ? "Unmute" : "Mute"}
      isActive={!isMuted}
      feedback="Sound On"
      showFeedback={showFeedback && !isMuted}
      className="absolute bottom-4 right-4 z-50"
    />
  );
} 