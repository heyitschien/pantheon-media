import { cn } from "@/lib/utils";

interface PantheonCardProps {
  mediaId: string;
  title: string;
  coverImage: string;
  isPantheonOriginal: boolean;
  onHover: () => void;
}

export function PantheonCard({
  mediaId,
  title,
  coverImage,
  isPantheonOriginal,
  onHover,
}: PantheonCardProps) {
  return (
    <div 
      className="w-full rounded-lg group-hover:opacity-0 group-hover:invisible transition duration-200"
      onMouseEnter={onHover}
    >
      <div className="relative h-[176px] rounded-lg overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover rounded-lg brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg">
          <div className="absolute bottom-0 p-3 w-full">
            <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
          </div>
        </div>
        {/* Pantheon Badge */}
        {isPantheonOriginal && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-pantheon-purple via-pantheon-pink to-pantheon-purple px-2 py-1 text-xs font-bold rounded-md text-white shadow-lg shadow-pantheon-purple/20 backdrop-blur-sm">
              P
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 