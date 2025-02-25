# CI/CD Setup Guide

## Overview
This guide walks through the setup process for the Modern Streaming Hub's CI/CD pipeline, including GitHub Actions configuration, Vercel integration, and required secrets.

## Prerequisites

### 1. GitHub Repository Setup
- GitHub account with admin access
- Repository created and code pushed
- Branch protection rules configured

### 2. Vercel Setup
- Vercel account created
- Project imported
- Team permissions configured

### 3. Development Environment
- Node.js 20.x or later
- Bun package manager
- Vercel CLI installed

## Required Secrets

### GitHub Secrets
```bash
# Vercel Integration
VERCEL_TOKEN=           # Vercel deployment token
VERCEL_ORG_ID=         # Vercel organization ID
VERCEL_PROJECT_ID=     # Vercel project ID

# Testing & Quality
CODECOV_TOKEN=         # Codecov integration token
```

## Step-by-Step Setup

### 1. GitHub Actions Setup

1. Create Workflows Directory
   ```bash
   mkdir -p .github/workflows
   ```

2. Add Workflow Files
   ```bash
   # Copy workflow files
   cp docs/development/ci-cd/workflows/* .github/workflows/
   ```

3. Configure Branch Protection
   - Go to Repository Settings > Branches
   - Add rule for `main` branch
   - Enable required status checks
   - Require PR reviews

### 2. Vercel Integration

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Link Project
   ```bash
   vercel link
   ```

3. Configure Environments
   ```bash
   # Development
   vercel env pull .env.development
   
   # Preview/Staging
   vercel env pull .env.preview
   
   # Production
   vercel env pull .env.production
   ```

### 3. Quality Gates Setup

1. Configure ESLint
   ```bash
   # Install dependencies
   bun add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   
   # Copy config
   cp docs/development/ci-cd/configuration/.eslintrc.js .
   ```

2. Setup Testing
   ```bash
   # Install Vite Test
   bun add -D vitest @vitest/coverage-c8
   
   # Copy test config
   cp docs/development/ci-cd/configuration/vitest.config.ts .
   ```

3. Configure TypeScript
   ```bash
   # Copy strict config
   cp docs/development/ci-cd/configuration/tsconfig.json .
   ```

## Environment Configuration

### Development
```env
NODE_ENV=development
VERCEL_ENV=development
API_URL=http://localhost:3000
```

### Preview/Staging
```env
NODE_ENV=production
VERCEL_ENV=preview
API_URL=https://api.staging.modernstreaminghub.com
```

### Production
```env
NODE_ENV=production
VERCEL_ENV=production
API_URL=https://api.modernstreaminghub.com
```

## Verification Steps

### 1. Local Verification
```bash
# Install dependencies
bun install

# Run type check
bun run type-check

# Run linting
bun run lint

# Run tests
bun run test

# Build project
bun run build
```

### 2. CI Pipeline Verification
1. Create a test branch
2. Make a small change
3. Create a PR
4. Verify all checks pass
5. Check preview deployment

### 3. Deployment Verification
1. Merge PR to main
2. Verify staging deployment
3. Create release tag
4. Verify production deployment

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify dependencies
   - Check build scripts

2. **Deployment Failures**
   - Verify Vercel tokens
   - Check environment variables
   - Review deployment logs

3. **Test Failures**
   - Check test configuration
   - Review test environment
   - Verify test dependencies

## Maintenance

### Regular Tasks
1. Update dependencies
2. Review and update workflows
3. Audit secrets
4. Check resource usage

### Security Considerations
1. Rotate secrets regularly
2. Review access permissions
3. Audit deployment logs
4. Monitor security alerts

## Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Test Docs](https://vitest.dev/)

### Support
- GitHub Issues
- Vercel Support
- Team Documentation

## Next Steps
1. Set up monitoring
2. Configure alerts
3. Implement advanced features
4. Document custom workflows 