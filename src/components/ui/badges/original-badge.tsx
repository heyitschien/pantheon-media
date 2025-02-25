import { cn } from '@/lib/utils';

interface OriginalBadgeProps {
  className?: string;
}

export function OriginalBadge({ className }: OriginalBadgeProps) {
  return (
    <span
      className={cn(
        'text-3xl font-extrabold bg-gradient-lotus bg-clip-text text-transparent drop-shadow-lg transition-all duration-300 hover:scale-105 brightness-125',
        className
      )}
    >
      P
    </span>
  );
} 