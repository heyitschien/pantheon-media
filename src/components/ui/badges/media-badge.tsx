import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MediaBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: string;
  icon?: React.ReactNode;
  shadowColor?: string;
}

export const MediaBadge = React.forwardRef<HTMLDivElement, MediaBadgeProps>(
  ({ className, children, gradient, icon, shadowColor, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "px-2 py-1 text-xs font-bold rounded-md text-white",
          // Animation and hover effects
          "transition-all duration-300 hover:scale-105",
          // Shadow effect
          "shadow-lg",
          // Backdrop blur for better contrast
          "backdrop-blur-sm",
          // Custom gradient if provided
          gradient,
          className
        )}
        style={shadowColor ? { '--tw-shadow-color': shadowColor } as React.CSSProperties : undefined}
        {...props}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </div>
      </div>
    );
  }
);

MediaBadge.displayName = "MediaBadge"; 