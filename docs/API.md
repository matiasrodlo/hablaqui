# Hablaquí API Documentation

## Overview
The Hablaquí API provides endpoints for managing users, specialists, appointments, chat, payments, and more. All endpoints are RESTful and return JSON responses.

## Base URL
```
https://api.hablaqui.cl
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Error Handling
All errors follow this format:
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "user"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

### Users

#### GET /user/profile
Get user profile information.

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "profile": {
    "phone": "+1234567890",
    "birthDate": "1990-01-01",
    "gender": "male"
  }
}
```

#### PUT /user/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "birthDate": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "profile": {
    "phone": "+1234567890",
    "birthDate": "1990-01-01",
    "gender": "male"
  }
}
```

### Specialists

#### GET /specialist/list
Get list of specialists with filtering options.

**Query Parameters:**
- `specialty` (optional): Filter by specialty
- `rating` (optional): Minimum rating
- `price` (optional): Maximum price
- `availability` (optional): Available time slots

**Response:**
```json
{
  "specialists": [
    {
      "id": "specialist_id",
      "name": "Dr. Jane Smith",
      "specialties": ["Anxiety", "Depression"],
      "rating": 4.8,
      "price": 50,
      "availability": ["2024-03-20T10:00:00Z"]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### GET /specialist/:id
Get specialist details.

**Response:**
```json
{
  "id": "specialist_id",
  "name": "Dr. Jane Smith",
  "specialties": ["Anxiety", "Depression"],
  "rating": 4.8,
  "price": 50,
  "availability": ["2024-03-20T10:00:00Z"],
  "bio": "Professional bio",
  "education": [
    {
      "degree": "PhD",
      "field": "Psychology",
      "institution": "University"
    }
  ]
}
```

### Appointments

#### POST /appointments
Create a new appointment.

**Request Body:**
```json
{
  "specialistId": "specialist_id",
  "date": "2024-03-20T10:00:00Z",
  "duration": 60,
  "type": "video"
}
```

**Response:**
```json
{
  "id": "appointment_id",
  "specialistId": "specialist_id",
  "userId": "user_id",
  "date": "2024-03-20T10:00:00Z",
  "duration": 60,
  "type": "video",
  "status": "scheduled"
}
```

#### GET /appointments
Get user's appointments.

**Query Parameters:**
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
{
  "appointments": [
    {
      "id": "appointment_id",
      "specialistId": "specialist_id",
      "userId": "user_id",
      "date": "2024-03-20T10:00:00Z",
      "duration": 60,
      "type": "video",
      "status": "scheduled"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Chat

#### GET /chat/conversations
Get user's chat conversations.

**Response:**
```json
{
  "conversations": [
    {
      "id": "conversation_id",
      "participants": [
        {
          "id": "user_id",
          "name": "John Doe",
          "role": "user"
        },
        {
          "id": "specialist_id",
          "name": "Dr. Jane Smith",
          "role": "specialist"
        }
      ],
      "lastMessage": {
        "content": "Hello!",
        "timestamp": "2024-03-19T15:30:00Z"
      }
    }
  ]
}
```

#### GET /chat/:conversationId/messages
Get messages from a conversation.

**Query Parameters:**
- `limit` (optional): Number of messages to return
- `before` (optional): Get messages before this timestamp

**Response:**
```json
{
  "messages": [
    {
      "id": "message_id",
      "content": "Hello!",
      "senderId": "user_id",
      "timestamp": "2024-03-19T15:30:00Z"
    }
  ],
  "hasMore": false
}
```

#### POST /chat/:conversationId/messages
Send a message in a conversation.

**Request Body:**
```json
{
  "content": "Hello!"
}
```

**Response:**
```json
{
  "id": "message_id",
  "content": "Hello!",
  "senderId": "user_id",
  "timestamp": "2024-03-19T15:30:00Z"
}
```

### Payments

#### POST /payments/create
Create a payment for an appointment.

**Request Body:**
```json
{
  "appointmentId": "appointment_id",
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "id": "payment_id",
  "status": "pending",
  "amount": 50,
  "currency": "USD",
  "paymentUrl": "https://payment-gateway.com/pay"
}
```

#### GET /payments/:id
Get payment status.

**Response:**
```json
{
  "id": "payment_id",
  "status": "completed",
  "amount": 50,
  "currency": "USD",
  "completedAt": "2024-03-19T15:30:00Z"
}
```

### Evaluations

#### POST /evaluations
Create a new evaluation.

**Request Body:**
```json
{
  "specialistId": "specialist_id",
  "rating": 5,
  "comment": "Great session!",
  "categories": {
    "punctuality": 5,
    "attention": 5,
    "professionalism": 5
  }
}
```

**Response:**
```json
{
  "id": "evaluation_id",
  "specialistId": "specialist_id",
  "userId": "user_id",
  "rating": 5,
  "comment": "Great session!",
  "categories": {
    "punctuality": 5,
    "attention": 5,
    "professionalism": 5
  },
  "createdAt": "2024-03-19T15:30:00Z"
}
```

## Webhooks

### POST /webhooks/payment
Payment status update webhook.

**Request Body:**
```json
{
  "paymentId": "payment_id",
  "status": "completed",
  "timestamp": "2024-03-19T15:30:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| USER_001 | User not found |
| USER_002 | Invalid user data |
| SPEC_001 | Specialist not found |
| SPEC_002 | Invalid specialist data |
| APPT_001 | Invalid appointment data |
| APPT_002 | Time slot not available |
| PAY_001 | Payment failed |
| PAY_002 | Invalid payment data |
| CHAT_001 | Conversation not found |
| CHAT_002 | Invalid message data |

## Best Practices

1. Always handle errors appropriately
2. Use proper authentication
3. Implement rate limiting
4. Cache responses when possible
5. Use pagination for list endpoints
6. Validate input data
7. Use HTTPS for all requests
8. Keep tokens secure
9. Monitor API usage
10. Follow REST conventions

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| /auth/* | 10 requests per minute |
| /user/* | 100 requests per minute |
| /specialist/* | 100 requests per minute |
| /appointments/* | 50 requests per minute |
| /chat/* | 200 requests per minute |
| /payments/* | 50 requests per minute |

## Versioning

The API is versioned through the URL:
```
https://api.hablaqui.cl/v1/...
```

Current version: v1

## Support

For API support, contact:
- Email: api-support@hablaqui.cl
- Documentation: https://docs.hablaqui.cl
- Status: https://status.hablaqui.cl 