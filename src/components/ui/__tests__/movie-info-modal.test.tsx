import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MovieInfoModal } from '../movie-info-modal';
import { getPreviewVideo } from '@/services/r2-video';
import { TestWrapper } from '@/test/test-wrapper';

// Mock the R2 video service
vi.mock('@/services/r2-video', () => ({
  getPreviewVideo: vi.fn().mockResolvedValue({
    videoUrl: 'https://pub-efb559f53e774c5a81743a42a82bb9a2.r2.dev/pantheon-highlight.mp4',
    posterUrl: 'https://pub-efb559f53e774c5a81743a42a82bb9a2.r2.dev/pantheon-highlight.jpg'
  })
}));

// ... existing code ... 