import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../hover-card';
import { renderWithWrapper, simulateHover, simulateUnhover, waitForStateUpdate } from '@/test/test-wrapper';

describe('HoverCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show content on hover', async () => {
    renderWithWrapper(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    await simulateHover(trigger);

    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument();
    });
  });

  it('should hide content on unhover', async () => {
    renderWithWrapper(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    await simulateHover(trigger);
    await simulateUnhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Hover content')).not.toBeInTheDocument();
    });
  });

  it('should apply correct transition classes', async () => {
    renderWithWrapper(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent className="test-content">Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');
    await simulateHover(trigger);

    const content = await screen.findByText('Hover content');
    expect(content.parentElement).toHaveClass(
      'z-50',
      'animate-in',
      'fade-in-0',
      'zoom-in-95'
    );
  });

  it('should handle rapid hover/unhover gracefully', async () => {
    renderWithWrapper(
      <HoverCard>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover content</HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Hover me');

    // Rapid hover/unhover sequence
    await simulateHover(trigger);
    await simulateUnhover(trigger);
    await simulateHover(trigger);

    // Content should be visible after final hover
    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument();
    });
  });

  it('should maintain proper z-index stacking', async () => {
    renderWithWrapper(
      <>
        <HoverCard>
          <HoverCardTrigger>First</HoverCardTrigger>
          <HoverCardContent>First content</HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger>Second</HoverCardTrigger>
          <HoverCardContent>Second content</HoverCardContent>
        </HoverCard>
      </>
    );

    const firstTrigger = screen.getByText('First');
    const secondTrigger = screen.getByText('Second');

    await simulateHover(firstTrigger);
    await simulateHover(secondTrigger);

    const firstContent = screen.getByText('First content');
    const secondContent = screen.getByText('Second content');

    expect(firstContent.parentElement).toHaveClass('z-50');
    expect(secondContent.parentElement).toHaveClass('z-50');
  });
}); 