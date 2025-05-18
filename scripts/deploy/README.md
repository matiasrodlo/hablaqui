# Deployment Configuration

This directory contains configuration files for deploying the Hablaqui application to various cloud platforms.

## Directory Structure
```
deploy/
├── README.md              # This file
├── buildspec.yml          # AWS CodeBuild specification
├── buildspec-backend.yml  # Backend build specification
├── buildspec-frontend.yml # Frontend build specification
├── cloudbuild.yaml        # Google Cloud Build configuration
└── dispatch.yaml          # GitHub Actions dispatch configuration
```

## Configuration Files

### 1. AWS CodeBuild (buildspec.yml)
AWS CodeBuild specification for building and deploying Docker containers to Amazon ECR.

#### Build Phases
1. **Pre-build**
   - ECR login
   - Environment variable setup
   - Required variables:
     - `API_URL`: Backend API endpoint
     - `MERCADOPAGO_KEY`: Payment gateway key
     - `PORT`: Service port
     - `SEGMENT_API_KEY`: Analytics key
     - `SENDGRID_API_KEY`: Email service key
     - `URLDB`: Database connection string
     - `VUE_APP_LANDING`: Landing page URL
     - `API_ABSOLUTE`: Absolute API URL
     - `VUE_APP_URL`: Frontend URL

2. **Build**
   - Builds Docker images using docker-compose
   - Builds both API and landing UI services
   - Uses `docker-compose-cloud.yml` configuration
   - Implements build caching
   - Handles dependency installation
   - Manages build artifacts

3. **Post-build**
   - Tags and pushes Docker images to ECR
   - Creates both latest and versioned tags
   - Generates image metadata artifacts
   - Updates deployment configurations
   - Triggers deployment workflows
   - Handles rollback procedures

### 2. Google Cloud Build (cloudbuild.yaml)
Google Cloud Build configuration for deploying the application to Google Cloud Platform.

#### Build Steps
1. **Landing Page**
   - Install dependencies
   - Create environment configuration
   - Generate static files
   - Deploy to App Engine
   - Configure CDN settings
   - Set up monitoring

2. **API Service**
   - Install dependencies
   - Create environment configuration
   - Deploy to App Engine
   - Configure scaling
   - Set up logging
   - Enable monitoring

### 3. GitHub Actions (dispatch.yaml)
Configuration for routing requests to appropriate services.

#### Routes
- API: `api.hablaqui.cl/*`
  - Handles API requests
  - Manages authentication
  - Processes business logic
  - Returns API responses

- Frontend: `www.hablaqui.cl/*`
  - Serves static content
  - Handles client routing
  - Manages assets
  - Provides user interface

## Environment Variables

### Required Variables
1. API Service
   - Database connection
   - API endpoints
   - Authentication keys
   - Service integrations
   - Monitoring configuration
   - Logging settings

2. Frontend Service
   - API endpoints
   - Third-party service keys
   - Analytics configuration
   - CDN settings
   - Cache configuration
   - Performance monitoring

## Usage

### AWS Deployment
```bash
# Trigger AWS CodeBuild
aws codebuild start-build --project-name hablaqui-build

# Monitor build status
aws codebuild batch-get-builds --ids <build-id>

# View build logs
aws logs get-log-events --log-group-name /aws/codebuild/hablaqui-build
```

### Google Cloud Deployment
```bash
# Deploy to Google Cloud
gcloud builds submit --config=cloudbuild.yaml

# Monitor deployment
gcloud app deploy --project=hablaqui

# View deployment logs
gcloud app logs tail
```

## Best Practices

### AWS CodeBuild
1. Use versioned tags for Docker images
   - Follow semantic versioning
   - Include build metadata
   - Maintain version history
   - Enable rollbacks

2. Implement proper error handling
   - Catch and log errors
   - Provide fallback options
   - Monitor error rates
   - Alert on critical issues

3. Use environment variables
   - Store sensitive data securely
   - Use consistent naming
   - Document required variables
   - Provide default values

### Google Cloud Build
1. Use appropriate machine types
   - Match resource needs
   - Optimize costs
   - Scale appropriately
   - Monitor performance

2. Implement proper dependency management
   - Use lock files
   - Pin versions
   - Regular updates
   - Security patches

### GitHub Actions
1. Use specific URL patterns
   - Clear routing rules
   - Proper error handling
   - Request validation
   - Security measures

## Troubleshooting

### Common Issues
1. Build Failures
   - Check environment variables
   - Verify Docker configuration
   - Review build logs
   - Check resource limits
   - Verify dependencies
   - Test locally

2. Deployment Issues
   - Verify service configurations
   - Check routing rules
   - Review deployment logs
   - Test endpoints
   - Check permissions
   - Verify quotas

3. Environment Issues
   - Validate environment variables
   - Check service connectivity
   - Review configuration files
   - Test integrations
   - Verify security
   - Check monitoring

## Related Documentation
- [Main Scripts Documentation](../README.md)
- [Development Guidelines](../../docs/DEVELOPMENT.md)
- [Architecture Documentation](../../docs/ARCHITECTURE.md)
- [Contributing Guidelines](../../CONTRIBUTING.md) 