# Development Environment Configuration

This directory contains Docker Compose configurations for the Hablaqui application's development environment.

## Files

- `docker-compose-dev.yml`: Local development setup
- `docker-compose-cloud.yml`: Cloud development setup

## Local Development Setup

### Services

1. **Frontend (landing-ui)**
   - Development server with hot-reloading
   - Nuxt.js development server
   - Volume mounts for live code updates
   - Development-specific environment variables

2. **Backend (api-restful)**
   - Node.js API server
   - MongoDB connection
   - JWT authentication
   - External service integrations
   - Volume mounts for live code updates

### Environment Variables

#### Frontend Variables
```yaml
API_ABSOLUTE: http://localhost:3000
NODE_ENV: development
VUE_APP_URL: http://localhost:3000/api/v1
HOST: 0.0.0.0
PORT: 8080
```

#### Backend Variables
```yaml
# Database
URLDB: mongodb+srv://...
NODE_ENV: development
PORT: 3000

# JWT
JWT_SECRET: api-hablaqui2021
JWT_ALGORITHM: HS256
JWT_EXPIRATION: 30d
JWT_EXPIRATION_REFRESH: 3d
JWT_SECRET_REFRESH: api-refresh-hablaqui2021
PASSWORD_RECOVERY_JWT_EXPIRATION: 40m

# External Services
API_URL: http://localhost:3000/
VUE_APP_LANDING: http://localhost:9000/
BUCKETNAME: hablaqui-content
AWS_ACCESS_KEY_ID: ...
AWS_SECRET_ACCESS_KEY: ...
AWS_REGION: sa-east-1
MERCADOPAGO_KEY: ...
NO_REPLY_EMAIL: no-reply@hablaqui.com
NO_REPLY_PASSWORD: ...
SENDGRID_API_KEY: ...
SEGMENT_API_KEY: ...
KEY_API_TESTMAILS: ...
NAMESPACE_TESTMAILS: ...
```

## Cloud Development Setup

### Network Configuration

- Custom network: `hablaqui-network`
- Subnet: 192.168.81.0/24
- Fixed IPs:
  - Frontend: 192.168.81.10
  - Backend: 192.168.81.20

### Environment Variables

All environment variables are loaded from external sources:
```yaml
API_URL: $API_URL
MERCADOPAGO_KEY: $MERCADOPAGO_KEY
PORT: $PORT
SEGMENT_API_KEY: $SEGMENT_API_KEY
SENDGRID_API_KEY: $SENDGRID_API_KEY
URLDB: $URLDB
VUE_APP_LANDING: $VUE_APP_LANDING
```

## Usage

### Local Development

1. Start services:
   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

2. Access services:
   - Frontend: http://localhost:9000
   - Backend: http://localhost:3000

### Cloud Development

1. Set environment variables:
   ```bash
   export API_URL=...
   export MERCADOPAGO_KEY=...
   # ... set other variables
   ```

2. Start services:
   ```bash
   docker-compose -f docker-compose-cloud.yml up
   ```

## Development Workflow

1. **Code Changes**
   - Make changes to source code
   - Changes are automatically reflected due to volume mounts
   - Hot-reloading enabled for frontend

2. **Dependencies**
   - Add new dependencies to package.json
   - Rebuild container or restart services

3. **Environment Variables**
   - Update variables in docker-compose files
   - Restart affected services

4. **Database**
   - Development database is automatically connected
   - Use MongoDB Compass or similar tools for management

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :8080
   lsof -i :9000
   ```

2. **Volume Mount Issues**
   ```bash
   # Check volume mounts
   docker-compose -f docker-compose-dev.yml config
   ```

3. **Environment Variables**
   ```bash
   # Verify environment variables
   docker-compose -f docker-compose-dev.yml config
   ```

4. **Network Issues**
   ```bash
   # Check network configuration
   docker network ls
   docker network inspect hablaqui-network
   ```

### Debugging

1. **Container Logs**
   ```bash
   # View logs for all services
   docker-compose -f docker-compose-dev.yml logs

   # View logs for specific service
   docker-compose -f docker-compose-dev.yml logs landing-ui
   ```

2. **Container Shell**
   ```bash
   # Access container shell
   docker-compose -f docker-compose-dev.yml exec landing-ui sh
   ```

3. **Container Status**
   ```bash
   # Check container status
   docker-compose -f docker-compose-dev.yml ps
   ```

## Best Practices

1. **Development**
   - Use volume mounts for live code updates
   - Keep node_modules in container
   - Use development-specific environment variables

2. **Security**
   - Never commit sensitive data
   - Use environment variables for secrets
   - Follow principle of least privilege

3. **Performance**
   - Use appropriate resource limits
   - Monitor container resource usage
   - Optimize build process

4. **Maintenance**
   - Keep base images updated
   - Regular security audits
   - Document all changes 