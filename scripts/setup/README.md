# Development Environment Setup

This directory contains scripts and configurations for setting up the development environment for the Hablaqui application.

## Directory Structure
```
setup/
├── README.md              # This file
├── install_dependencies.sh # Dependency installation script
├── setup_environment.sh   # Environment setup script
└── verify_installation.sh # Installation verification script
```

## Setup Scripts

### 1. Dependency Installation (install_dependencies.sh)
Installs all required dependencies for development.

#### Features
- Node.js and npm installation
- Python environment setup
- Database setup
- Development tools installation
- Version management
- Dependency verification

#### Usage
```bash
# Run the installation script
./install_dependencies.sh

# Verify installation
./verify_installation.sh
```

### 2. Environment Setup (setup_environment.sh)
Configures the development environment.

#### Features
- Environment variable configuration
- Service configuration
- Development tools setup
- Local database setup
- Test data population
- Service initialization

#### Usage
```bash
# Run the setup script
./setup_environment.sh

# Verify environment
./verify_installation.sh
```

### 3. Installation Verification (verify_installation.sh)
Verifies the installation and setup of the development environment.

#### Features
- Dependency verification
- Environment check
- Service health check
- Configuration validation
- Test execution
- Report generation

#### Usage
```bash
# Run verification
./verify_installation.sh

# Generate detailed report
./verify_installation.sh --verbose
```

## Environment Variables

### Required Variables
1. Development Environment
   - `NODE_ENV`: Development environment
   - `PORT`: Development server port
   - `API_URL`: Local API endpoint
   - `DB_URL`: Local database URL
   - `DEBUG`: Debug mode flag

2. Service Configuration
   - `REDIS_URL`: Redis connection
   - `MONGODB_URI`: MongoDB connection
   - `JWT_SECRET`: JWT signing key
   - `SESSION_SECRET`: Session key

3. Third-party Services
   - `STRIPE_KEY`: Payment service
   - `SENDGRID_KEY`: Email service
   - `AWS_ACCESS_KEY`: AWS access
   - `AWS_SECRET_KEY`: AWS secret

## Best Practices

### Environment Setup
1. Use version control
   - Track configuration changes
   - Document modifications
   - Review changes
   - Maintain history

2. Secure sensitive data
   - Use environment variables
   - Implement encryption
   - Rotate credentials
   - Monitor access

3. Regular maintenance
   - Update dependencies
   - Check configurations
   - Verify security
   - Monitor performance

## Troubleshooting

### Common Issues
1. Installation Problems
   - Check system requirements
   - Verify permissions
   - Review error logs
   - Check dependencies
   - Test connectivity
   - Verify paths

2. Configuration Issues
   - Validate environment variables
   - Check file permissions
   - Review service status
   - Test connections
   - Verify paths
   - Check logs

3. Service Issues
   - Check service status
   - Verify configurations
   - Review error logs
   - Test endpoints
   - Check dependencies
   - Monitor resources

## Related Documentation
- [Main Scripts Documentation](../README.md)
- [Development Guidelines](../../docs/DEVELOPMENT.md)
- [Architecture Documentation](../../docs/ARCHITECTURE.md)
- [Contributing Guidelines](../../CONTRIBUTING.md) 