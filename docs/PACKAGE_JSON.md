# Root Package.json Configuration

This file defines the root project configuration and workspace setup for the Hablaqui project.

## Project Metadata
- `name`: "hablaqui" - Root project name
- `version`: "1.0.0" - Project version (semantic versioning)
- `description`: "Hablaqui - Mental Health Marketplace and SaaS Platform"
- `private`: true - Prevents accidental publishing to npm

## Workspace Configuration
The project uses npm workspaces to manage multiple packages:
```json
"workspaces": [
  "api",     // Backend API workspace
  "landing", // Landing page workspace
  "movil"    // Mobile app workspace
]
```

## Scripts

### Development Scripts
- `dev`: Run all services in development mode
- `dev:api`: Run API in development mode
- `dev:landing`: Run landing page in development mode
- `dev:mobile`: Run mobile app in development mode

### Build Scripts
- `build`: Build all services
- `build:api`: Build API
- `build:landing`: Build landing page
- `build:mobile`: Build mobile app

### Test Scripts
- `test`: Run all tests
- `test:api`: Run API tests
- `test:landing`: Run landing page tests
- `test:mobile`: Run mobile app tests

### Lint Scripts
- `lint`: Run all linters
- `lint:api`: Run API linter
- `lint:landing`: Run landing page linter
- `lint:mobile`: Run mobile app linter

## Development Dependencies
- `concurrently`: Run multiple commands concurrently

## Usage

1. Install dependencies:
```bash
npm install
```

2. Run development servers:
```bash
npm run dev
```

3. Build all services:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

5. Run linters:
```bash
npm run lint
```

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md)
- [Development Guidelines](../DEVELOPMENT.md)
- [Deployment Guide](../DEPLOYMENT.md) 