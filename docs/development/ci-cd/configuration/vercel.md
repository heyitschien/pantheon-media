# Vercel Configuration

## Overview
This guide details the Vercel configuration for the Modern Streaming Hub platform, covering project setup, deployment configuration, and optimization strategies.

## Project Configuration

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["sfo1", "cdg1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

### Environment Variables

#### Development
```env
NODE_ENV=development
VERCEL_ENV=development
API_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### Preview/Staging
```env
NODE_ENV=production
VERCEL_ENV=preview
API_URL=https://api.staging.modernstreaminghub.com
NEXT_PUBLIC_API_URL=https://api.staging.modernstreaminghub.com
```

#### Production
```env
NODE_ENV=production
VERCEL_ENV=production
API_URL=https://api.modernstreaminghub.com
NEXT_PUBLIC_API_URL=https://api.modernstreaminghub.com
```

## Deployment Configuration

### Build Settings
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ]
}
```

### Routes Configuration
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "headers": {
        "cache-control": "s-maxage=0"
      },
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Edge Functions

### Configuration
```typescript
// edge-config.ts
export const config = {
  runtime: 'edge',
  regions: ['sfo1', 'cdg1']
};
```

### Implementation
```typescript
// api/edge.ts
import { config } from './edge-config';

export default async function handler(req: Request) {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'content-type': 'application/json' }
  });
}

export { config };
```

## Caching Strategy

### Browser Cache
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Edge Cache
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate=600"
        }
      ]
    }
  ]
}
```

## Domain Configuration

### Custom Domains
```json
{
  "domains": [
    {
      "domain": "modernstreaminghub.com",
      "type": "primary"
    },
    {
      "domain": "staging.modernstreaminghub.com",
      "type": "staging"
    }
  ]
}
```

### SSL Configuration
- Automatic SSL/TLS certificates
- Force HTTPS
- HSTS enabled

## Team & Collaboration

### Access Control
```json
{
  "scope": "team_member",
  "teamId": "team_123",
  "permissions": [
    "deployments:read",
    "deployments:write",
    "env:read"
  ]
}
```

### Git Integration
- GitHub integration
- Automatic deployments
- Branch previews

## Monitoring & Analytics

### Web Vitals
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

### Usage Analytics
- Bandwidth usage
- Function invocations
- Build minutes
- Deployment frequency

## Security Configuration

### Headers
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Environment Protection
- Production protection rules
- Secret encryption
- Access controls

## Best Practices

### 1. Performance
- Use Edge Functions
- Optimize caching
- Enable compression
- Minimize dependencies

### 2. Security
- Secure headers
- Environment isolation
- Regular audits
- Access control

### 3. Monitoring
- Set up alerts
- Monitor metrics
- Track usage
- Review logs

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check build logs
   - Verify dependencies
   - Review environment variables
   - Check build commands

2. **Deployment Issues**
   - Check domain configuration
   - Verify team access
   - Review deployment logs
   - Check Git integration

3. **Performance Issues**
   - Review Edge Function logs
   - Check caching configuration
   - Monitor resource usage
   - Analyze Web Vitals

## Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Edge Functions](https://vercel.com/docs/edge-network/edge-functions)

### Tools
- Vercel CLI
- Vercel Dashboard
- Analytics Dashboard
- Integration Tools

### Support
- Vercel Support
- Community Forums
- Documentation
- Team Resources 