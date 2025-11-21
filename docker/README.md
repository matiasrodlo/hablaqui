# Hablaqui Docker Configuration

This directory contains Docker configurations for the Hablaqui application, including development and production environments.

## Directory Structure

```
docker/
├── dev/
│   ├── docker-compose-dev.yml    # Local development configuration
│   ├── docker-compose-cloud.yml  # Cloud development configuration
│   └── README.md                 # Development environment documentation
├── prod/
│   ├── Dockerfile.dev            # Development container configuration
│   ├── Dockerfile.cloud          # Production container configuration
│   └── README.md                 # Production environment documentation
└── README.md                     # This file
```

## Overview

The Hablaqui application uses Docker for both development and production environments. The setup includes:

- Development environment with hot-reloading
- Production environment with optimized builds
- Cloud deployment configuration
- Comprehensive documentation

## Quick Start

### Development

1. Navigate to the development directory:
   ```bash
   cd docker/dev
   ```

2. Start the development environment:
   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

3. Access the application:
   - Frontend: http://localhost:9000
   - Backend: http://localhost:3000

### Production

1. Navigate to the production directory:
   ```bash
   cd docker/prod
   ```

2. Build the production image:
   ```bash
   docker build -f Dockerfile.cloud -t hablaqui-prod .
   ```

3. Run the production container:
   ```bash
   docker run -d \
     --name hablaqui-prod \
     -p 3000:3000 \
     -e NODE_ENV=production \
     hablaqui-prod
   ```

## Environment Configuration

### Development Environment

The development environment includes:
- Hot-reloading for frontend and backend
- Volume mounts for live code updates
- Development-specific environment variables
- MongoDB connection
- External service integrations

See [Development Environment Documentation](dev/README.md) for details.

### Production Environment

The production environment includes:
- Optimized builds
- Security configurations
- Production-specific environment variables
- Monitoring and logging
- Backup and recovery procedures

See [Production Environment Documentation](prod/README.md) for details.

## Services

### Frontend (landing-ui)
- Nuxt.js application
- Development server with hot-reloading
- Production-optimized builds
- Environment-specific configurations

### Backend (api-restful)
- Node.js API server
- MongoDB connection
- JWT authentication
- External service integrations

## Network Configuration

### Development Network
- Local development: localhost
- Ports: 3000 (backend), 9000 (frontend)

### Production Network
- Custom network: hablaqui-network
- Subnet: 192.168.81.0/24
- Fixed IPs for services

## Security

### Development
- Local-only access
- Development-specific secrets
- Debugging enabled
- Hot-reloading security

### Production
- SSL/TLS encryption
- Secure environment variables
- Resource limits
- Regular security updates

## Monitoring

### Development
- Console logging
- Error tracking
- Performance monitoring
- Debug tools

### Production
- Health checks
- Structured logging
- Metrics collection
- Alert system

## Maintenance

### Regular Tasks
- Update base images
- Security patches
- Dependency updates
- Backup verification

### Cleanup
- Remove unused containers
- Clean up images
- Manage volumes
- Log rotation

## Best Practices

1. **Development**
   - Use volume mounts
   - Keep node_modules in container
   - Use development variables
   - Regular testing

2. **Production**
   - Optimize builds
   - Secure configurations
   - Regular updates
   - Monitoring

3. **Security**
   - Never commit secrets
   - Use environment variables
   - Regular audits
   - Access control

4. **Documentation**
   - Keep updated
   - Include examples
   - Document changes
   - Version control

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :9000
   ```

2. **Container Issues**
   ```bash
   # Check container status
   docker ps -a

   # View container logs
   docker logs <container-id>
   ```

3. **Network Issues**
   ```bash
   # Check network configuration
   docker network ls
   docker network inspect hablaqui-network
   ```

### Getting Help

1. Check the documentation in each directory
2. Review the troubleshooting sections
3. Check container logs
4. Verify environment variables

## Contributing

1. Follow the directory structure
2. Update documentation
3. Test changes
4. Submit pull requests

## License

This project is licensed under the MIT License - see the LICENSE file for details. 