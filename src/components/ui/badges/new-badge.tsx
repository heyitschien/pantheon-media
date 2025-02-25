import { MediaBadge, MediaBadgeProps } from './media-badge';
import { theme } from '@/config/theme';

export const NewBadge = (props: Omit<MediaBadgeProps, 'gradient' | 'shadowColor'>) => (
  <MediaBadge
    gradient={theme.gradients.badges.new}
    shadowColor="rgb(6 78 59)" // emerald-900
    {...props}
  />
); 