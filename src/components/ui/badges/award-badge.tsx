import { MediaBadge, MediaBadgeProps } from './media-badge';
import { Trophy } from 'lucide-react';
import { theme } from '@/config/theme';

export const AwardBadge = (props: Omit<MediaBadgeProps, 'gradient' | 'shadowColor' | 'icon'>) => (
  <MediaBadge
    gradient={theme.gradients.badges.award}
    shadowColor="rgb(120 53 15)" // amber-900
    icon={<Trophy className="w-3 h-3" />}
    {...props}
  />
); 