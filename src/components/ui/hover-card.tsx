import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onError?: (error: Error) => void;
}

const HoverCard = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Root>,
  HoverCardProps
>(({ children, openDelay = 200, closeDelay = 150, onError, ...props }, ref) => {
  const { toast } = useToast();

  const handleError = React.useCallback((error: Error) => {
    console.error('HoverCard error:', error);
    onError?.(error);
    toast({
      title: "Error",
      description: "Failed to load preview",
      variant: "destructive",
    });
  }, [onError, toast]);

  return (
    <HoverCardPrimitive.Root
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    >
      {children}
    </HoverCardPrimitive.Root>
  );
});
HoverCard.displayName = "HoverCard";

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  title?: string;
  metadata?: {
    year?: string;
    duration?: string;
    rating?: string;
    genres?: string[];
  };
}

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, align = "center", sideOffset = 4, title, metadata, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (props['data-state'] === 'open') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 150);
    }
  }, [props['data-state']]);

  return (
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover/95 p-2 text-popover-foreground shadow-md outline-none backdrop-blur-sm",
        "transform-gpu will-change-transform",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1",
        "data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
        "transition-[transform,opacity] duration-200 ease-spring",
        isLoading && "opacity-90 cursor-wait",
        error && "border-destructive",
        className
      )}
      role="tooltip"
      aria-live="polite"
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-1">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="text-sm text-destructive text-center">
          Failed to load preview
        </div>
      ) : (
        <div className="space-y-1.5">
          {title && (
            <h4 className="text-sm font-semibold leading-none">{title}</h4>
          )}
          {metadata && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {metadata.year && <span>{metadata.year}</span>}
              {metadata.duration && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{metadata.duration}</span>
                </>
              )}
              {metadata.rating && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{metadata.rating}</span>
                </>
              )}
              {metadata.genres && metadata.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 w-full">
                  {metadata.genres.map((genre) => (
                    <span key={genre} className="text-xs text-muted-foreground/75">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </HoverCardPrimitive.Content>
  );
});
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

const usePreloadHoverCard = () => {
  const [isPreloaded, setIsPreloaded] = React.useState(false);

  const preload = React.useCallback(() => {
    if (!isPreloaded) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = '/api/hover-card-data';
      document.head.appendChild(link);
      setIsPreloaded(true);
    }
  }, [isPreloaded]);

  return preload;
};

export { HoverCard, HoverCardTrigger, HoverCardContent, usePreloadHoverCard };
