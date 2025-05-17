![image](https://github.com/user-attachments/assets/aa68a627-647a-4ec2-b814-58ddb9c0f82b)

A mental health marketplace and SaaS platform connecting users with a network of over 200 certified specialists. The platform facilitates scheduling, payments, and secure video consultations.

## Features
Hablaquí provides a comprehensive solution for mental health services:

- **Appointment Scheduling**: Intuitive interface for users to find and book appointments with mental health specialists based on availability, specialty, and price.

- **Video Consultations**: Secure, HIPAA-compliant video consultation system enabling private sessions between users and specialists from any location.

- **Payment Processing**: Integrated MercadoPago payment system for handling transactions, including appointment fees, subscription plans, and specialist payouts.

- **Real-time Notifications**: Pusher-powered notification system for appointment reminders, messages, and important updates.

- **User Management**: Complete user profiles for both clients and specialists, including credentials verification for mental health professionals.

- **Specialist Discovery**: Advanced search and filtering system to help users find the right specialist for their specific needs.

## Demo
[Watch on YouTube](https://www.youtube.com/watch?v=3OhoPxWkAcM)

## Architecture
The project consists of three main components:

### Backend API (`/api`)
- Node.js-based REST API with ESM module support
- MongoDB database (connected via environment variables)
- Docker containerization for development and production
- Google Cloud App Engine deployment
- Push notifications via Pusher
- Email integration with SendGrid and Mailgun
- Authentication with Google OAuth
- Payment processing with MercadoPago
- Analytics with Segment

### Mobile App (`/movil`)
- Flutter-based cross-platform application (SDK >=2.7.0 <3.0.0)
- Supports iOS and Android
- Web version available
- Key packages:
  - flutter_pusher for real-time notifications
  - carousel_slider for UI components
  - http for API communication
  - shared_preferences for local storage
  - url_launcher for external links
  - intl for internationalization

### Landing Page (`/landing`)
- Nuxt.js (Vue.js) based frontend
- Modern component architecture
- Responsive design
- SEO optimized
- Google Cloud App Engine deployment

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Flutter SDK
- Docker and Docker Compose
- Google Cloud SDK (for deployment)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hablaqui.git
cd hablaqui
```

2. Backend Setup
```bash
cd api
npm install
# Create .env file with required environment variables (see cloudbuild.yaml for reference)
docker-compose -f docker-compose-dev.yml up
```

3. Mobile App Setup
```bash
cd movil
flutter pub get
flutter run
```

4. Landing Page Setup
```bash
cd landing
npm install
# Create .env file with required environment variables (see cloudbuild.yaml for reference)
npm run dev
```

## Project Structure
```
hablaqui/
├── api/                # Backend API service
│   ├── server/         # Server implementation
│   ├── Dockerfile.dev  # Development Docker configuration
│   └── Dockerfile.cloud # Production Docker configuration
├── movil/              # Flutter mobile application
│   ├── lib/            # Dart source code
│   ├── android/        # Android platform code
│   ├── ios/            # iOS platform code
│   └── web/            # Web platform code
├── landing/            # Nuxt.js landing page
│   ├── components/     # Vue components
│   ├── pages/          # Vue pages
│   └── assets/         # Static assets
├── images/             # Shared images
└── .github/            # GitHub Actions workflows
```

## Deployment
The application is deployed to Google Cloud Platform:
- Frontend landing page: www.hablaqui.cl
- Backend API: api.hablaqui.cl
- Deployment is managed through Cloud Build (cloudbuild.yaml)
- Routing is configured in dispatch.yaml

## Environment Variables
Both the API and landing page require environment variables for proper functionality. Reference the cloudbuild.yaml file for the complete list of required variables.

## About
The project was developed during university studies and has been incubated by Digevo Ventures and accelerated by Start-Up Chile.