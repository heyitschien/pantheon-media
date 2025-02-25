import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  MovieControlButton,
  PlayButton,
  AddToListButton,
  LikeButton,
  InfoButton,
  VolumeButton
} from '../movie-controls';

describe('MovieControlButton', () => {
  const mockOnClick = vi.fn();

  it('renders with primary variant styling', () => {
    render(
      <MovieControlButton
        onClick={mockOnClick}
        icon={<span>Icon</span>}
        label="Test Button"
        variant="primary"
      />
    );
    
    const button = screen.getByLabelText('Test Button');
    expect(button).toHaveClass('bg-white', 'text-black', 'hover:bg-white/90');
  });

  it('renders with secondary variant styling', () => {
    render(
      <MovieControlButton
        onClick={mockOnClick}
        icon={<span>Icon</span>}
        label="Test Button"
        variant="secondary"
      />
    );
    
    const button = screen.getByLabelText('Test Button');
    expect(button).toHaveClass('bg-zinc-800/80', 'hover:bg-zinc-700/80');
  });

  it('shows feedback when active and feedback is enabled', () => {
    render(
      <MovieControlButton
        onClick={mockOnClick}
        icon={<span>Icon</span>}
        label="Test Button"
        isActive={true}
        feedback="Test Feedback"
        showFeedback={true}
      />
    );
    
    expect(screen.getByText('Test Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Test Button')).toHaveClass('bg-zinc-700/80');
  });

  it('handles click events', () => {
    render(
      <MovieControlButton
        onClick={mockOnClick}
        icon={<span>Icon</span>}
        label="Test Button"
      />
    );
    
    fireEvent.click(screen.getByLabelText('Test Button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

describe('PlayButton', () => {
  const mockOnClick = vi.fn();

  it('renders compact version without text', () => {
    render(<PlayButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Play');
    expect(button).toHaveClass('bg-white', 'text-black');
    expect(screen.queryByText('Play')).not.toBeInTheDocument();
  });

  it('renders expanded version with text', () => {
    render(<PlayButton onClick={mockOnClick} showText={true} />);
    
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'px-8',
      'py-2',
      'bg-white',
      'text-black',
      'rounded-lg',
      'font-semibold'
    );
  });
});

describe('AddToListButton', () => {
  const mockOnClick = vi.fn();

  it('renders in default state', () => {
    render(<AddToListButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Add to List');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('bg-zinc-700/80');
  });

  it('shows feedback when active', () => {
    render(
      <AddToListButton
        onClick={mockOnClick}
        isActive={true}
        showFeedback={true}
      />
    );
    
    expect(screen.getByText('Added to List')).toBeInTheDocument();
    expect(screen.getByLabelText('Add to List')).toHaveClass('bg-zinc-700/80');
  });

  it('animates icon on active state', () => {
    render(
      <AddToListButton
        onClick={mockOnClick}
        isActive={true}
      />
    );
    
    const icon = screen.getByLabelText('Add to List').querySelector('svg');
    expect(icon).toHaveClass('rotate-90');
  });
});

describe('LikeButton', () => {
  const mockOnClick = vi.fn();

  it('renders in default state', () => {
    render(<LikeButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Like');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('bg-zinc-700/80');
  });

  it('shows feedback when active', () => {
    render(
      <LikeButton
        onClick={mockOnClick}
        isActive={true}
        showFeedback={true}
      />
    );
    
    expect(screen.getByText('Added to Liked')).toBeInTheDocument();
    expect(screen.getByLabelText('Like')).toHaveClass('bg-zinc-700/80');
  });

  it('animates icon on active state', () => {
    render(
      <LikeButton
        onClick={mockOnClick}
        isActive={true}
      />
    );
    
    const icon = screen.getByLabelText('Like').querySelector('svg');
    expect(icon).toHaveClass('scale-110');
  });
});

describe('InfoButton', () => {
  const mockOnClick = vi.fn();

  it('renders with correct styling', () => {
    render(<InfoButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('More Info');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-zinc-800/80', 'hover:bg-zinc-700/80');
  });

  it('handles click events', () => {
    render(<InfoButton onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByLabelText('More Info'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});

describe('VolumeButton', () => {
  const mockOnClick = vi.fn();

  it('renders muted state', () => {
    render(
      <VolumeButton
        onClick={mockOnClick}
        isMuted={true}
      />
    );
    
    const button = screen.getByLabelText('Unmute');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('bg-zinc-700/80');
  });

  it('renders unmuted state with feedback', () => {
    render(
      <VolumeButton
        onClick={mockOnClick}
        isMuted={false}
        showFeedback={true}
      />
    );
    
    expect(screen.getByText('Sound On')).toBeInTheDocument();
    expect(screen.getByLabelText('Mute')).toHaveClass('bg-zinc-700/80');
  });

  it('positions correctly in layout', () => {
    render(
      <VolumeButton
        onClick={mockOnClick}
        isMuted={true}
      />
    );
    
    const button = screen.getByLabelText('Unmute');
    expect(button).toHaveClass('absolute', 'bottom-4', 'right-4', 'z-50');
  });
}); 