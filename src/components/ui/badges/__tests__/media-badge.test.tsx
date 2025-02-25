import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MediaBadge } from '../media-badge';
import { theme } from '@/config/theme';

describe('MediaBadge', () => {
  it('should render with default styles', () => {
    render(
      <MediaBadge>
        Test Badge
      </MediaBadge>
    );
    
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass(
      'px-2',
      'py-1',
      'text-xs',
      'font-bold',
      'rounded-md',
      'text-white'
    );
  });

  it('should apply custom gradient', () => {
    render(
      <MediaBadge gradient={theme.gradients.badges.top10}>
        Top 10
      </MediaBadge>
    );
    
    const badge = screen.getByText('Top 10');
    expect(badge.parentElement).toHaveClass(theme.gradients.badges.top10);
  });

  it('should render with icon', () => {
    render(
      <MediaBadge icon={<span data-testid="test-icon" />}>
        Badge with Icon
      </MediaBadge>
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Badge with Icon')).toBeInTheDocument();
  });

  it('should apply hover effects', () => {
    render(
      <MediaBadge>
        Hover Badge
      </MediaBadge>
    );
    
    const badge = screen.getByText('Hover Badge');
    expect(badge.parentElement).toHaveClass(
      'transition-all',
      'duration-300',
      'hover:scale-105'
    );
  });

  it('should apply shadow effect', () => {
    render(
      <MediaBadge shadowColor="red">
        Shadow Badge
      </MediaBadge>
    );
    
    const badge = screen.getByText('Shadow Badge');
    expect(badge.parentElement).toHaveClass('shadow-lg');
    expect(badge.parentElement).toHaveStyle({
      '--tw-shadow-color': 'red'
    });
  });

  it('should combine custom className with default styles', () => {
    render(
      <MediaBadge className="custom-class">
        Custom Badge
      </MediaBadge>
    );
    
    const badge = screen.getByText('Custom Badge');
    expect(badge.parentElement).toHaveClass('custom-class');
    expect(badge.parentElement).toHaveClass('px-2', 'py-1', 'rounded-md');
  });
}); 