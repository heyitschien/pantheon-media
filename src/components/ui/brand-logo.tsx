import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/PantheonLogo_blk-text-1000.png" 
        alt="Pantheon Media Logo" 
        className="h-10 w-auto"
      />
      <h1 
        className={cn(
          "text-2xl font-extrabold tracking-tight",
          "bg-gradient-lotus",
          "bg-clip-text text-transparent",
          "hover:opacity-90 transition-opacity",
        )}
      >
        PANTHEON MEDIA
      </h1>
    </div>
  );
} 