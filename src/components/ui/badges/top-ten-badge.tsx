import { MediaBadge, MediaBadgeProps } from './media-badge';
import { theme } from '@/config/theme';

export const TopTenBadge = (props: Omit<MediaBadgeProps, 'gradient' | 'shadowColor'>) => (
  <MediaBadge
    gradient={theme.gradients.badges.top10}
    shadowColor="rgb(127 29 29)" // red-900
    {...props}
  />
); 