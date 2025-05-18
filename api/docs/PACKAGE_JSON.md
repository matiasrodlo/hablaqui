# API Package.json Configuration

This document explains the configuration and dependencies for the Hablaqui API project.

## Project Metadata
- **name**: hablaqui-api
- **version**: 1.0.0
- **description**: Backend API for Hablaqui Mental Health Marketplace and SaaS Platform
- **private**: true

## Main Entry Point
- **main**: server.js - The main entry point for the API server

## Scripts

### Development Scripts
- `npm run dev`: Run server with auto-reload using nodemon
- `npm start`: Run server in production mode

### Build Scripts
- `npm run build`: Build and verify the project (runs lint and test)
- `npm run clean`: Clean build artifacts

### Test Scripts
- `npm test`: Run tests using Jest
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate test coverage report

### Lint Scripts
- `npm run lint`: Lint all files using ESLint
- `npm run lint:fix`: Fix linting issues automatically

## Dependencies

### Production Dependencies
- **express**: ^4.18.2 - Web framework for Node.js
- **cors**: ^2.8.5 - CORS middleware for handling cross-origin requests
- **helmet**: ^7.0.0 - Security headers middleware
- **morgan**: ^1.10.0 - HTTP request logger middleware
- **compression**: ^1.7.4 - Response compression middleware
- **express-rate-limit**: ^6.7.0 - Rate limiting middleware
- **dotenv**: ^16.0.3 - Environment variables management

### Development Dependencies
- **nodemon**: ^2.0.22 - Auto-reload for development
- **jest**: ^29.5.0 - Testing framework
- **eslint**: ^8.40.0 - Linting tool
- **supertest**: ^6.3.3 - HTTP testing library

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Development:
   ```bash
   npm run dev
   ```

3. Production:
   ```bash
   npm start
   ```

4. Testing:
   ```bash
   npm test
   ```

5. Linting:
   ```bash
   npm run lint
   ``` 