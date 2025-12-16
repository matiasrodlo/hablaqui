# API Documentation

## Overview
The Hablaquí API is a Node.js-based REST API that serves as the backend for the entire platform. It handles user authentication, appointment scheduling, video consultations, and payment processing.

## Architecture

### Directory Structure
```
api/
├── server/           # Main server code
│   ├── controllers/  # Request handlers
│   ├── models/      # Database models
│   ├── routes/      # API endpoints
│   ├── services/    # Business logic
│   ├── middleware/  # Request middleware
│   ├── utils/       # Helper functions
│   ├── config/      # Configuration
│   ├── schemas/     # Data validation
│   ├── templates/   # Email templates
│   └── static/      # Static files
├── tests/           # Test files
├── server.js        # Entry point
├── app.yaml         # App Engine config
└── package.json     # Dependencies
```

### Key Components

#### Controllers
- Handle HTTP requests and responses
- Validate input data
- Call appropriate services
- Format responses

#### Models
- Define database schemas
- Handle data validation
- Implement business rules
- Manage relationships

#### Services
- Implement business logic
- Handle external integrations
- Manage data operations
- Process payments

#### Middleware
- Authentication
- Request validation
- Error handling
- Logging

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh
- POST /api/auth/logout

### Users
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/specialists
- GET /api/users/specialists/:id

### Appointments
- GET /api/appointments
- POST /api/appointments
- PUT /api/appointments/:id
- DELETE /api/appointments/:id

### Payments
- POST /api/payments/create
- GET /api/payments/status/:id
- POST /api/payments/webhook

## Database Schema

### Users
```javascript
{
  id: ObjectId,
  email: String,
  password: String,
  role: String,
  profile: {
    name: String,
    phone: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  specialistId: ObjectId,
  date: Date,
  status: String,
  payment: {
    id: String,
    status: String,
    amount: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## External Integrations

### Payment Processing
- MercadoPago integration for handling payments
- Webhook handling for payment status updates
- Secure payment flow implementation

### Video Consultations
- Pusher integration for real-time features
- Video session management
- Recording and storage

### Email Notifications
- SendGrid for transactional emails
- Mailgun for marketing emails
- Email template management

## Security

### Authentication
- JWT-based authentication
- Refresh token mechanism
- Password hashing with bcrypt

### Authorization
- Role-based access control
- Resource ownership validation
- API key management

### Data Protection
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## Development

### Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "auth"
```

### Deployment
The API is deployed to Google Cloud Platform using App Engine. See the deployment documentation for details.

## Monitoring and Logging

### Logging
- Winston for application logging
- Error tracking and monitoring
- Request logging

### Performance
- Response time monitoring
- Error rate tracking
- Resource usage metrics

## API Versioning
The API uses semantic versioning. Current version: v1

## Error Handling
Standard error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Custom limits for specific endpoints 