# Architecture Documentation

## Overview
This section outlines the system architecture, design decisions, and technical specifications of the Modern Streaming Hub.

## System Architecture

### 🏗 Core Architecture
- [System Overview](core/system-overview.md)
- [Data Flow](core/data-flow.md)
- [State Management](core/state-management.md)
- [Component Architecture](core/component-architecture.md)

### 🔌 Integration Points
- [External APIs](integrations/external-apis.md)
- [Authentication](integrations/authentication.md)
- [Video Streaming](integrations/video-streaming.md)

### 🚀 Performance
- [Optimization Strategies](performance/optimization.md)
- [Caching Strategy](performance/caching.md)
- [Loading States](performance/loading-states.md)

## Technical Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion

### Testing
- Vite Test
- Testing Library
- MSW for API Mocking

### CI/CD
- GitHub Actions
- Vercel Deployment
- Automated Testing

## Design Patterns

### 1. Component Patterns
- Compound Components
- Render Props
- Custom Hooks
- Higher-Order Components

### 2. State Management
- Context API Usage
- Local State
- Server State
- Form State

### 3. Performance Patterns
- Code Splitting
- Lazy Loading
- Memoization
- Virtual Lists

## Quick Links
- [Development Documentation](../development/README.md)
- [Component Documentation](../components/README.md)
- [API Documentation](../api/README.md)

## Architecture Decisions
Each major architectural decision is documented in ADR (Architecture Decision Record) format:
- [ADR-001: State Management Strategy](decisions/adr-001-state-management.md)
- [ADR-002: Testing Strategy](decisions/adr-002-testing.md)
- [ADR-003: API Integration](decisions/adr-003-api-integration.md) 