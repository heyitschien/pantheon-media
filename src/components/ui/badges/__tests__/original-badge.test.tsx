import { render, screen } from '@testing-library/react';
import { OriginalBadge } from '../original-badge';

describe('OriginalBadge', () => {
  it('should render with correct text and gradient', () => {
    render(<OriginalBadge />);
    const badge = screen.getByText('P');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gradient-lotus', 'bg-clip-text', 'text-transparent');
  });

  it('should apply custom className while preserving default styles', () => {
    render(<OriginalBadge className="custom-class" />);
    const badge = screen.getByText('P');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('bg-gradient-lotus', 'bg-clip-text', 'text-transparent');
  });

  it('should apply text styling', () => {
    render(<OriginalBadge />);
    const badge = screen.getByText('P');
    expect(badge).toHaveClass('text-xl', 'font-extrabold', 'drop-shadow-md');
  });
}); 