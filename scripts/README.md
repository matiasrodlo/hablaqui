# Scripts

This directory contains automation scripts for setting up development environments and deploying the Hablaqui application.

## Directory Structure
```
scripts/
├── setup/           # Development environment setup scripts
│   ├── README.md    # Setup documentation
│   ├── setup.sh     # Main setup script
│   ├── create-env.sh # Environment configuration
│   └── install-tools.sh # Development tools installation
└── deploy/          # Deployment configuration files
    ├── README.md    # Deployment documentation
    ├── buildspec.yml           # AWS CodeBuild specification
    ├── buildspec-backend.yml   # Backend build specification
    ├── buildspec-frontend.yml  # Frontend build specification
    ├── cloudbuild.yaml         # Google Cloud Build configuration
    └── dispatch.yaml           # GitHub Actions dispatch configuration
```

## Setup Scripts
The `setup/` directory contains scripts for:
- Initializing development environments
- Installing dependencies
- Configuring local development tools
- Setting up pre-commit hooks
- Managing environment variables
- Configuring development tools

### Key Features
- Automated environment setup
- Dependency management
- Development tool configuration
- Environment variable handling
- Security best practices
- Cross-platform compatibility

## Deployment Scripts
The `deploy/` directory contains configuration files for:
- AWS CodeBuild specifications
- Google Cloud Build configurations
- GitHub Actions workflows
- CI/CD pipeline configurations
- Multi-environment deployments
- Container orchestration

### Key Features
- Multi-cloud deployment support
- Automated build processes
- Environment-specific configurations
- Container management
- Artifact handling
- Deployment monitoring

## Usage

### Development Setup
```bash
# Run setup script
./scripts/setup/setup.sh

# Configure environment
./scripts/setup/create-env.sh

# Install development tools
./scripts/setup/install-tools.sh
```

### Deployment
```bash
# Deploy to AWS
./scripts/deploy/deploy-aws.sh

# Deploy to Google Cloud
./scripts/deploy/deploy-gcp.sh

# Deploy to multiple environments
./scripts/deploy/deploy-all.sh
```

## Configuration Files

### AWS CodeBuild (buildspec.yml)
- Defines build phases for AWS CodeBuild
- Configures build environment
- Specifies build commands and artifacts
- Manages Docker container builds
- Handles environment variables
- Generates deployment artifacts

### Google Cloud Build (cloudbuild.yaml)
- Defines build steps for Google Cloud Build
- Configures build environment
- Specifies build commands and artifacts
- Manages service deployments
- Handles environment configuration
- Controls build resources

### GitHub Actions (dispatch.yaml)
- Configures GitHub Actions workflows
- Defines workflow triggers
- Specifies job configurations
- Manages deployment routing
- Controls service endpoints
- Handles request distribution

## Best Practices
1. Keep scripts idempotent
   - Ensure scripts can be run multiple times safely
   - Implement proper checks before modifications
   - Use atomic operations where possible

2. Include error handling
   - Implement proper error catching
   - Provide meaningful error messages
   - Log errors appropriately
   - Handle edge cases

3. Add logging
   - Use consistent log formats
   - Include timestamps
   - Log important operations
   - Provide debug information

4. Document dependencies
   - List required tools
   - Specify version requirements
   - Document system requirements
   - Note compatibility issues

5. Use environment variables
   - Store sensitive data securely
   - Use consistent naming
   - Document required variables
   - Provide default values

6. Follow shell scripting best practices
   - Use proper shebang lines
   - Implement proper exit codes
   - Follow POSIX standards
   - Use proper quoting

## Contributing
1. Follow the existing script structure
   - Maintain consistent organization
   - Use standard naming conventions
   - Follow established patterns
   - Keep related files together

2. Add documentation for new scripts
   - Include usage examples
   - Document parameters
   - Explain dependencies
   - Note any limitations

3. Include error handling
   - Catch common errors
   - Provide helpful messages
   - Log errors appropriately
   - Handle edge cases

4. Test scripts before committing
   - Test on multiple platforms
   - Verify error handling
   - Check edge cases
   - Validate output

5. Update this README when adding new scripts
   - Document new features
   - Update usage examples
   - Add new best practices
   - Update directory structure

## Related Documentation
- [Development Guidelines](../docs/DEVELOPMENT.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Architecture Documentation](../docs/ARCHITECTURE.md)
- [Contributing Guidelines](../CONTRIBUTING.md) 