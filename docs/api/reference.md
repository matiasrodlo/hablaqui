# API Reference

## Overview
// This document provides detailed information about the Hablaquí API endpoints, including request/response formats, authentication, and error handling.

## Base URL
// The base URL for all API requests
```
https://api.hablaqui.com/v1
```

## Authentication
// All API requests require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Rate Limiting
// API usage limits to prevent abuse and ensure fair usage
- 100 requests per minute per IP // Basic rate limit for all endpoints
- 1000 requests per hour per user // User-specific rate limit
- Custom limits for specific endpoints // Special limits for resource-intensive endpoints

## Endpoints

### Authentication

#### POST /auth/login
// Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "string", // User's email address
  "password": "string" // User's password
}
```

**Response:**
```json
{
  "token": "string", // JWT access token
  "refreshToken": "string", // JWT refresh token
  "user": {
    "id": "string", // User's unique identifier
    "email": "string", // User's email address
    "role": "string", // User's role (user/specialist/admin)
    "profile": {
      "name": "string", // User's full name
      "phone": "string", // User's phone number
      "avatar": "string" // URL to user's avatar image
    }
  }
}
```

**Error Codes:**
- 400: Invalid credentials // Wrong email or password
- 401: Unauthorized // Missing or invalid token
- 429: Too many requests // Rate limit exceeded

### Users

#### GET /users/profile
// Get the current user's profile.

**Response:**
```json
{
  "id": "string", // User's unique identifier
  "email": "string", // User's email address
  "role": "string", // User's role
  "profile": {
    "name": "string", // User's full name
    "phone": "string", // User's phone number
    "avatar": "string" // URL to user's avatar
  },
  "createdAt": "string", // Account creation timestamp
  "updatedAt": "string" // Last update timestamp
}
```

**Error Codes:**
- 401: Unauthorized // Missing or invalid token
- 404: User not found // User profile doesn't exist

### Appointments

#### POST /appointments
// Create a new appointment.

**Request Body:**
```json
{
  "specialistId": "string", // ID of the specialist
  "date": "string", // Appointment date and time
  "duration": "number", // Duration in minutes
  "notes": "string" // Optional appointment notes
}
```

**Response:**
```json
{
  "id": "string", // Appointment ID
  "userId": "string", // User's ID
  "specialistId": "string", // Specialist's ID
  "date": "string", // Appointment date and time
  "status": "string", // Appointment status
  "payment": {
    "id": "string", // Payment ID
    "status": "string", // Payment status
    "amount": "number" // Payment amount
  },
  "createdAt": "string", // Creation timestamp
  "updatedAt": "string" // Last update timestamp
}
```

**Error Codes:**
- 400: Invalid request // Invalid input data
- 401: Unauthorized // Missing or invalid token
- 404: Specialist not found // Specialist doesn't exist
- 409: Time slot unavailable // Time slot is already booked

## Error Handling

### Error Response Format
// Standard error response format for all API errors
```json
{
  "error": {
    "code": "string", // Error code
    "message": "string", // Human-readable error message
    "details": {} // Additional error details
  }
}
```

### Common Error Codes
// Standard HTTP error codes used throughout the API
- 400: Bad Request // Invalid input data
- 401: Unauthorized // Authentication required
- 403: Forbidden // Insufficient permissions
- 404: Not Found // Resource doesn't exist
- 409: Conflict // Resource conflict
- 429: Too Many Requests // Rate limit exceeded
- 500: Internal Server Error // Server-side error

## Data Models

### User
// User data model
```json
{
  "id": "string", // Unique identifier
  "email": "string", // Email address
  "role": "string", // User role
  "profile": {
    "name": "string", // Full name
    "phone": "string", // Phone number
    "avatar": "string" // Avatar URL
  },
  "createdAt": "string", // Creation timestamp
  "updatedAt": "string" // Last update timestamp
}
```

### Appointment
// Appointment data model
```json
{
  "id": "string", // Unique identifier
  "userId": "string", // User ID
  "specialistId": "string", // Specialist ID
  "date": "string", // Appointment date
  "status": "string", // Appointment status
  "payment": {
    "id": "string", // Payment ID
    "status": "string", // Payment status
    "amount": "number" // Payment amount
  },
  "createdAt": "string", // Creation timestamp
  "updatedAt": "string" // Last update timestamp
}
```

## Performance

### Response Times
// Expected API response times
- Average: < 200ms // Typical response time
- 95th percentile: < 500ms // 95% of requests
- 99th percentile: < 1000ms // 99% of requests

### Availability
// System availability metrics
- 99.9% uptime // Expected uptime
- 24/7 monitoring // Continuous monitoring
- Automatic failover // High availability

## Security

### Authentication
// Authentication mechanisms
- JWT-based authentication // Token-based auth
- Refresh token mechanism // Token refresh
- Password hashing with bcrypt // Secure password storage

### Data Protection
// Security measures
- HTTPS encryption // Secure communication
- Input validation // Data sanitization
- XSS protection // Cross-site scripting prevention
- CSRF protection // Cross-site request forgery prevention

## Versioning
// API versioning strategy
The API uses semantic versioning. The current version is v1.

## Support
// Support information
For API support, please contact the development team or create an issue in the repository. 