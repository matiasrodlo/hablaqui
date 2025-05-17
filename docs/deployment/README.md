# Deployment Documentation

## Overview
Hablaquí is deployed on Google Cloud Platform using App Engine, with a CI/CD pipeline managed through Cloud Build. The infrastructure is designed for scalability, security, and high availability.

## Project Structure
```
hablaqui/
├── api/              # Backend API
├── landing/          # Frontend application
├── movil/            # Mobile application
├── shared/           # Shared resources
│   ├── constants/    # Shared constants
│   ├── types/        # TypeScript types
│   └── utils/        # Shared utilities
├── config/           # Configuration files
│   ├── eslint/       # ESLint configuration
│   ├── jest/         # Jest testing config
│   └── prettier/     # Prettier formatting
├── docker/           # Docker configurations
│   ├── dev/          # Development environment
│   └── prod/         # Production environment
├── scripts/          # Utility scripts
│   ├── deploy/       # Deployment scripts
│   └── setup/        # Setup scripts
└── docs/             # Documentation
```

## Infrastructure

### Google Cloud Platform
- App Engine for hosting
- Cloud SQL for database
- Cloud Storage for files
- Cloud CDN for content delivery
- Cloud Monitoring for observability

### Domain Structure
- www.hablaqui.cl: Landing page
- api.hablaqui.cl: Backend API
- app.hablaqui.cl: Web application

## Development Environment

### Docker Setup
The project uses Docker for development and production environments:

#### Development
```bash
# Start development environment
docker-compose -f docker/dev/docker-compose.yml up
```

#### Production
```bash
# Build production images
docker-compose -f docker/prod/docker-compose.yml build

# Deploy to production
docker-compose -f docker/prod/docker-compose.yml up -d
```

### Configuration
The project uses several configuration files for code quality and consistency:

- ESLint: Code linting and style enforcement
- Prettier: Code formatting
- Jest: Testing configuration
- DeepSource: Code analysis

## Deployment Process

### CI/CD Pipeline
1. Code push triggers build
2. Automated testing
3. Build artifacts
4. Deploy to staging
5. Production deployment

### Cloud Build Configuration
```yaml
steps:
  # API Build
  - name: node:14
    entrypoint: npm
    args: ["install"]
    dir: "api"
  - name: node:14
    entrypoint: npm
    args: ["run", "build"]
    dir: "api"
  - name: "gcr.io/cloud-builders/gcloud"
    args: ["app", "deploy"]
    dir: "api"

  # Frontend Build
  - name: node:14
    entrypoint: npm
    args: ["install"]
    dir: "landing"
  - name: node:14
    entrypoint: npm
    args: ["run", "build"]
    dir: "landing"
  - name: "gcr.io/cloud-builders/gcloud"
    args: ["app", "deploy"]
    dir: "landing"
```

## Environment Configuration

### Environment Variables
```env
# API Configuration
API_URL=https://api.hablaqui.cl
MONGODB_URI=mongodb://...
PUSHER_APP_ID=your_pusher_id
PUSHER_CLUSTER=your_cluster
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret

# Frontend Configuration
FRONTEND_URL=https://www.hablaqui.cl
VUE_APP_API_URL=https://api.hablaqui.cl
VUE_APP_PUSHER_KEY=your_key
VUE_APP_PUSHER_CLUSTER=your_cluster

# Payment Configuration
MERCADOPAGO_KEY=your_key
MERCADOPAGO_SECRET=your_secret

# Email Configuration
SENDGRID_API_KEY=your_key
MAILGUN_API_KEY=your_key
NO_REPLY_EMAIL=no-reply@hablaqui.cl
```

## Security

### SSL/TLS
- Let's Encrypt certificates
- Automatic renewal
- HSTS configuration
- Secure headers

### Network Security
- VPC configuration
- Firewall rules
- Load balancing
- DDoS protection

## Monitoring

### Cloud Monitoring
- Uptime monitoring
- Performance metrics
- Error tracking
- Resource usage

### Logging
- Application logs
- Access logs
- Error logs
- Audit logs

## Backup and Recovery

### Database Backups
- Daily automated backups
- Point-in-time recovery
- Cross-region replication
- Backup verification

### Disaster Recovery
- Recovery procedures
- Failover testing
- Data restoration
- Business continuity

## Scaling

### Auto-scaling
- Instance scaling
- Load balancing
- Resource allocation
- Cost optimization

### Performance
- CDN configuration
- Caching strategy
- Database optimization
- Resource management

## Maintenance

### Updates
- Security patches
- Dependency updates
- Platform updates
- Configuration changes

### Monitoring
- Health checks
- Performance monitoring
- Error tracking
- Resource usage

## Troubleshooting

### Common Issues
- Deployment failures
- Performance issues
- Security incidents
- Database problems

### Resolution Steps
1. Check logs
2. Verify configuration
3. Test connectivity
4. Apply fixes

## Cost Management

### Resource Optimization
- Instance sizing
- Storage optimization
- Network usage
- CDN caching

### Budget Control
- Cost monitoring
- Usage alerts
- Resource limits
- Optimization recommendations

## Compliance

### Data Protection
- GDPR compliance
- Data encryption
- Access control
- Audit logging

### Security Standards
- ISO 27001
- SOC 2
- HIPAA
- PCI DSS

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies
3. Configure environment
4. Run development server

### Staging Environment
- Automated deployment
- Testing environment
- Performance testing
- Security scanning

### Production Deployment
- Zero-downtime deployment
- Rollback procedures
- Health checks
- Monitoring setup 