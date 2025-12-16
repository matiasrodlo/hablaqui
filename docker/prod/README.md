# Production Environment Configuration

This directory contains Docker configurations for the Hablaqui application's production environment.

## Files

- `Dockerfile.dev`: Development container configuration
- `Dockerfile.cloud`: Production container configuration

## Production Container Configuration

### Base Image
- Node.js 18.x
- Alpine Linux for minimal size
- Multi-stage build for optimization

### Build Stages

1. **Dependencies Stage**
   - Install production dependencies
   - Copy package files
   - Optimize node_modules

2. **Build Stage**
   - Build application
   - Generate static assets
   - Optimize for production

3. **Production Stage**
   - Copy only necessary files
   - Set production environment
   - Configure security settings

## Environment Configuration

### Required Variables

```yaml
# Application
NODE_ENV: production
PORT: 3000

# Database
URLDB: mongodb+srv://...

# Security
JWT_SECRET: <secure-secret>
JWT_ALGORITHM: HS256
JWT_EXPIRATION: 30d
JWT_EXPIRATION_REFRESH: 3d
JWT_SECRET_REFRESH: <secure-secret>
PASSWORD_RECOVERY_JWT_EXPIRATION: 40m

# External Services
API_URL: https://api.hablaqui.com/
VUE_APP_LANDING: https://hablaqui.com/
BUCKETNAME: hablaqui-content
AWS_ACCESS_KEY_ID: <access-key>
AWS_SECRET_ACCESS_KEY: <secret-key>
AWS_REGION: sa-east-1
MERCADOPAGO_KEY: <mercadopago-key>
NO_REPLY_EMAIL: no-reply@hablaqui.com
NO_REPLY_PASSWORD: <email-password>
SENDGRID_API_KEY: <sendgrid-key>
SEGMENT_API_KEY: <segment-key>
```

## Deployment

### Building Images

1. **Development Image**
   ```bash
   docker build -f Dockerfile.dev -t hablaqui-dev .
   ```

2. **Production Image**
   ```bash
   docker build -f Dockerfile.cloud -t hablaqui-prod .
   ```

### Running Containers

1. **Development**
   ```bash
   docker run -d \
     --name hablaqui-dev \
     -p 3000:3000 \
     -e NODE_ENV=development \
     hablaqui-dev
   ```

2. **Production**
   ```bash
   docker run -d \
     --name hablaqui-prod \
     -p 3000:3000 \
     -e NODE_ENV=production \
     hablaqui-prod
   ```

## Security Considerations

1. **Container Security**
   - Run as non-root user
   - Minimal base image
   - Regular security updates
   - Resource limits

2. **Network Security**
   - Internal network only
   - Exposed ports minimum
   - SSL/TLS encryption
   - Firewall rules

3. **Data Security**
   - Encrypted secrets
   - Secure environment variables
   - Regular backups
   - Access control

## Monitoring

1. **Health Checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

2. **Logging**
   - Structured logging
   - Log rotation
   - Error tracking
   - Performance metrics

3. **Metrics**
   - Resource usage
   - Response times
   - Error rates
   - User metrics

## Scaling

1. **Horizontal Scaling**
   - Load balancing
   - Session management
   - Database scaling
   - Cache strategy

2. **Vertical Scaling**
   - Resource limits
   - Memory optimization
   - CPU allocation
   - Storage management

## Backup and Recovery

1. **Database Backups**
   ```bash
   # Backup
   mongodump --uri="mongodb+srv://..." --out=/backup

   # Restore
   mongorestore --uri="mongodb+srv://..." /backup
   ```

2. **Container Backups**
   ```bash
   # Save container
   docker commit hablaqui-prod hablaqui-backup

   # Export container
   docker export hablaqui-prod > hablaqui-backup.tar
   ```

3. **Recovery Procedures**
   - Document recovery steps
   - Regular testing
   - Backup verification
   - Disaster recovery plan

## Maintenance

1. **Updates**
   - Regular base image updates
   - Security patches
   - Dependency updates
   - Configuration updates

2. **Cleanup**
   ```bash
   # Remove unused containers
   docker container prune

   # Remove unused images
   docker image prune

   # Remove unused volumes
   docker volume prune
   ```

3. **Monitoring**
   - Resource usage
   - Error rates
   - Performance metrics
   - Security alerts

## Best Practices

1. **Container Management**
   - Use specific versions
   - Regular updates
   - Resource limits
   - Health checks

2. **Security**
   - Regular audits
   - Access control
   - Encryption
   - Monitoring

3. **Performance**
   - Optimize builds
   - Resource management
   - Caching strategy
   - Load balancing

4. **Documentation**
   - Keep updated
   - Include examples
   - Document changes
   - Version control 