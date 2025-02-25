# Branch Protection Configuration

## Overview
This guide details the branch protection rules and policies for the Modern Streaming Hub platform, ensuring code quality and maintaining a secure development workflow.

## Protected Branches

### Main Branch
```json
{
  "branch": "main",
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "quality",
        "test",
        "build",
        "security"
      ]
    },
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    },
    "restrictions": {
      "users": [],
      "teams": ["maintainers"],
      "apps": ["github-actions"]
    }
  }
}
```

### Release Branches
```json
{
  "branch": "release/*",
  "protection": {
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "quality",
        "test",
        "build",
        "security",
        "staging-deploy"
      ]
    },
    "required_pull_request_reviews": {
      "required_approving_review_count": 2,
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": true
    }
  }
}
```

## Branch Naming Convention

### Pattern Rules
```
feature/*    # New features
fix/*        # Bug fixes
docs/*       # Documentation updates
refactor/*   # Code refactoring
test/*       # Test additions/updates
chore/*      # Maintenance tasks
```

### Examples
```bash
feature/video-player
fix/auth-timeout
docs/api-reference
refactor/state-management
test/streaming-performance
chore/dependency-updates
```

## Code Owners

### CODEOWNERS File
```yaml
# Global owners
*                    @team-leads

# Frontend
/src/components/     @frontend-team
/src/styles/         @frontend-team
/src/utils/          @frontend-team

# Backend
/api/                @backend-team
/server/             @backend-team

# Documentation
/docs/               @docs-team

# Configuration
/.github/            @devops-team
/config/             @devops-team
```

## Pull Request Requirements

### Template
```markdown
## Description
[Description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests passing
- [ ] PR title follows convention
```

### Required Checks
1. **Code Quality**
   - TypeScript compilation
   - ESLint validation
   - Code formatting
   - Complexity checks

2. **Testing**
   - Unit tests passing
   - Integration tests passing
   - Coverage thresholds met
   - Performance benchmarks

3. **Security**
   - Dependency scanning
   - SAST analysis
   - Secret detection
   - License compliance

## Merge Strategy

### Allowed Methods
```json
{
  "allow_merge_commit": false,
  "allow_squash_merge": true,
  "allow_rebase_merge": false,
  "squash_merge_commit_title": "PR_TITLE",
  "squash_merge_commit_message": "PR_BODY"
}
```

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

## Access Control

### Team Permissions
```json
{
  "teams": {
    "maintainers": {
      "permission": "maintain",
      "members": ["tech-leads", "senior-devs"]
    },
    "developers": {
      "permission": "write",
      "members": ["dev-team"]
    },
    "reviewers": {
      "permission": "read",
      "members": ["qa-team", "security-team"]
    }
  }
}
```

### Branch Restrictions
- Direct pushes to protected branches blocked
- Force pushes disabled
- Branch deletion restricted
- Linear history required

## Automation Rules

### Status Checks
```yaml
status_checks:
  required:
    - "TypeScript"
    - "ESLint"
    - "Tests"
    - "Build"
    - "Security"
  optional:
    - "Performance"
    - "Coverage"
    - "Dependencies"
```

### Auto-merge Configuration
```json
{
  "auto_merge": {
    "enabled": true,
    "merge_method": "squash",
    "required_checks": [
      "quality",
      "test",
      "security"
    ]
  }
}
```

## Best Practices

### 1. Code Review
- Require meaningful reviews
- Set review expiration
- Enforce review guidelines
- Track review metrics

### 2. Branch Management
- Regular cleanup
- Version tagging
- Branch lifecycle
- Merge documentation

### 3. Security
- Access audits
- Secret scanning
- Dependency updates
- Compliance checks

## Troubleshooting

### Common Issues
1. **Merge Conflicts**
   - Regular rebasing
   - Clear ownership
   - Conflict resolution
   - Team communication

2. **Review Process**
   - Review assignments
   - Response times
   - Review quality
   - Feedback loops

3. **Protection Rules**
   - Rule verification
   - Access checks
   - Status updates
   - Configuration sync

## Resources

### Documentation
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Pull Request Reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)

### Tools
- GitHub Settings
- Branch Protection UI
- Code Owners Validator
- PR Templates

### Support
- GitHub Support
- Team Guidelines
- Documentation
- Best Practices 