# GitHub Actions Configuration

## Overview
This guide details the GitHub Actions configuration for the Modern Streaming Hub platform, including workflow setup, secrets management, and optimization strategies.

## Workflow Structure

### Directory Layout
```bash
.github/
└── workflows/
    ├── main.yml       # Main CI/CD pipeline
    ├── preview.yml    # PR preview deployments
    └── release.yml    # Release automation
```

## Main Pipeline Configuration

### Triggers
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]
```

### Environment Setup
```yaml
env:
  NODE_VERSION: '20.x'
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Job Configuration
```yaml
jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    timeout-minutes: 15
    
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run type-check
      - run: bun run lint
      - run: bun run test
```

## Secrets Management

### Required Secrets
```yaml
# Vercel Deployment
VERCEL_TOKEN: ''         # Vercel deployment token
VERCEL_ORG_ID: ''       # Vercel organization ID
VERCEL_PROJECT_ID: ''   # Vercel project ID

# Testing & Quality
CODECOV_TOKEN: ''       # Codecov integration token

# API Keys
PEXELS_API_KEY: ''     # Pexels API access
TMDB_API_KEY: ''       # TMDB API access
```

### Secret Scopes
- Repository secrets
- Environment secrets
- Organization secrets

## Optimization Strategies

### 1. Caching
```yaml
- uses: actions/cache@v3
  with:
    path: |
      ~/.bun/install/cache
      .next/cache
    key: ${{ runner.os }}-modules-${{ hashFiles('**/bun.lockb') }}
```

### 2. Conditional Jobs
```yaml
jobs:
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: [quality, test]
    runs-on: ubuntu-latest
```

### 3. Matrix Builds
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    os: [ubuntu-latest, macos-latest]
```

## Environment Configuration

### 1. Development
```yaml
environment:
  name: development
  url: ${{ steps.deploy.outputs.url }}
```

### 2. Staging
```yaml
environment:
  name: staging
  url: https://staging.modernstreaminghub.com
```

### 3. Production
```yaml
environment:
  name: production
  url: https://modernstreaminghub.com
```

## Action Permissions

### Repository Permissions
```yaml
permissions:
  contents: read
  pull-requests: write
  deployments: write
  checks: write
```

### Environment Protection
```yaml
environment:
  name: production
  rules:
    - type: required_reviewers
      count: 2
```

## Custom Actions

### 1. Deployment Action
```yaml
# .github/actions/deploy/action.yml
name: 'Deploy to Vercel'
description: 'Deploys the application to Vercel'
inputs:
  environment:
    description: 'Deployment environment'
    required: true
runs:
  using: 'composite'
  steps:
    - run: vercel pull --yes --environment=${{ inputs.environment }}
    - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
    - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

### 2. Notification Action
```yaml
# .github/actions/notify/action.yml
name: 'Deployment Notification'
description: 'Sends deployment notifications'
inputs:
  status:
    description: 'Deployment status'
    required: true
runs:
  using: 'composite'
  steps:
    - run: |
        curl -X POST $WEBHOOK_URL \
          -H "Content-Type: application/json" \
          -d '{"status": "${{ inputs.status }}"}'
```

## Best Practices

### 1. Security
- Use minimal permissions
- Rotate secrets regularly
- Audit action usage
- Pin action versions

### 2. Performance
- Optimize build steps
- Use caching effectively
- Minimize job dependencies
- Clean up artifacts

### 3. Maintenance
- Document workflows
- Version control actions
- Monitor usage
- Regular updates

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check action versions
   - Verify secrets
   - Review logs
   - Check dependencies

2. **Timeout Issues**
   - Optimize build steps
   - Adjust timeout limits
   - Split large jobs
   - Use caching

3. **Permission Errors**
   - Check token scopes
   - Verify permissions
   - Review access
   - Update settings

## Resources

### Documentation
- [GitHub Actions](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Security Guides](https://docs.github.com/en/actions/security-guides)

### Tools
- GitHub Actions Dashboard
- Workflow Visualizer
- Status Badges
- Action Marketplace

### Support
- GitHub Support
- Community Forums
- Documentation
- Team Resources 