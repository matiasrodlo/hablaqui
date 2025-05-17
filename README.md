![image](https://github.com/user-attachments/assets/aa68a627-647a-4ec2-b814-58ddb9c0f82b)

# Hablaquí

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/hablaqui/graphs/commit-activity)

A mental health marketplace and SaaS platform connecting users with a network of over 200 certified specialists. The platform facilitates scheduling, payments, and secure video consultations.

Hablaquí was born at the Startup School of Adolfo Ibáñez University and was later incubated by Digevo Ventures, accelerated through Start-Up Chile, and backed by Google for Startups.

[Watch Product Demo](https://www.youtube.com/watch?v=3OhoPxWkAcM)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
Hablaquí provides a comprehensive solution for mental health services:

- **Appointment Scheduling**: Intuitive interface for users to find and book appointments with mental health specialists based on availability, specialty, and price.

- **Video Consultations**: Secure, HIPAA-compliant video consultation system enabling private sessions between users and specialists from any location.

- **Payment Processing**: Integrated MercadoPago payment system for handling transactions, including appointment fees, subscription plans, and specialist payouts.

- **Real-time Notifications**: Pusher-powered notification system for appointment reminders, messages, and important updates.

- **User Management**: Complete user profiles for both clients and specialists, including credentials verification for mental health professionals.

- **Specialist Discovery**: Advanced search and filtering system to help users find the right specialist for their specific needs.


## Technology Stack
The project is built using modern technologies and best practices:

### Backend
- Node.js with ESM modules
- MongoDB for data storage
- Docker for containerization
- Google Cloud Platform for hosting
- Pusher for real-time features
- SendGrid & Mailgun for email services
- Google OAuth for authentication
- MercadoPago for payments
- Segment for analytics

### Mobile
- Flutter for cross-platform development
- Dart SDK (>=2.7.0 <3.0.0)
- Key packages for enhanced functionality
- Material Design implementation

### Frontend
- Nuxt.js (Vue.js) framework
- Modern component architecture
- SEO optimization
- Responsive design principles

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

## Development

### Code Style
- ESLint for JavaScript/TypeScript
- Prettier for code formatting
- Flutter lint rules for mobile app
- Vue.js style guide compliance

### Testing
```bash
# Backend tests
cd api
npm test

# Mobile app tests
cd movil
flutter test

# Frontend tests
cd landing
npm run test
```

### Environment Setup
Create the following environment files:

1. Backend (`api/.env`):
```env
API_URL=your_api_url
MONGODB_URI=your_mongodb_uri
PUSHER_APP_ID=your_pusher_id
# ... other variables from cloudbuild.yaml
```

2. Frontend (`landing/.env`):
```env
API_ABSOLUTE=your_api_url
FRONTEND_URL=your_frontend_url
# ... other variables from cloudbuild.yaml
```

## Deployment
The application is deployed to Google Cloud Platform:
- Frontend landing page: www.hablaqui.cl
- Backend API: api.hablaqui.cl
- Deployment is managed through Cloud Build (cloudbuild.yaml)
- Routing is configured in dispatch.yaml

## Contributing
We welcome contributions to Hablaquí! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
- Website: [www.hablaqui.cl](https://www.hablaqui.cl)
- Email: [contact@hablaqui.cl](mailto:contact@hablaqui.cl)
- LinkedIn: [Hablaquí](https://linkedin.com/company/hablaqui)

---

Built with ❤️ Remotly

## Project Structure
```
hablaqui/
├── api/                      # Backend API service
│   ├── server/              # Server implementation
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── tests/              # API tests
│   ├── Dockerfile.dev      # Development Docker configuration
│   ├── Dockerfile.cloud    # Production Docker configuration
│   └── app.yaml           # Google Cloud configuration
│
├── movil/                   # Flutter mobile application
│   ├── lib/                # Dart source code
│   │   ├── screens/       # UI screens
│   │   ├── widgets/       # Reusable components
│   │   ├── models/        # Data models
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   ├── android/           # Android platform code
│   ├── ios/               # iOS platform code
│   ├── web/               # Web platform code
│   └── test/              # Mobile app tests
│
├── landing/                # Nuxt.js landing page
│   ├── components/        # Vue components
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   └── sections/     # Page sections
│   ├── pages/            # Vue pages
│   ├── assets/           # Static assets
│   │   ├── images/      # Image files
│   │   ├── styles/      # CSS/SCSS files
│   │   └── fonts/       # Font files
│   └── plugins/          # Nuxt plugins
│
├── shared/                # Shared resources
│   ├── constants/        # Shared constants
│   ├── types/           # TypeScript types
│   └── utils/           # Shared utilities
│
├── docs/                 # Documentation
│   ├── api/             # API documentation
│   ├── deployment/      # Deployment guides
│   └── development/     # Development guides
│
├── scripts/             # Build and utility scripts
│   ├── deploy/         # Deployment scripts
│   └── setup/          # Setup scripts
│
├── .github/             # GitHub configuration
│   ├── workflows/      # GitHub Actions
│   └── templates/      # PR and issue templates
│
├── docker/             # Docker configuration
│   ├── dev/           # Development environment
│   └── prod/          # Production environment
│
└── config/            # Configuration files
    ├── eslint/        # ESLint configuration
    ├── prettier/      # Prettier configuration
    └── jest/          # Jest configuration
```

### Directory Structure Guidelines

#### Backend (`/api`)
- Follow a modular architecture with clear separation of concerns
- Group related functionality in dedicated directories
- Keep controllers thin and move business logic to services
- Use middleware for cross-cutting concerns

#### Mobile App (`/movil`)
- Organize screens by feature or module
- Keep widgets reusable and independent
- Separate business logic from UI components
- Follow Flutter's recommended project structure

#### Landing Page (`/landing`)
- Use atomic design principles for components
- Keep pages simple and delegate to components
- Organize assets by type and purpose
- Use plugins for third-party integrations

#### Shared Resources (`/shared`)
- Share common code between projects
- Keep shared utilities framework-agnostic
- Use TypeScript for better type safety
- Document shared functionality

#### Documentation (`/docs`)
- Keep documentation close to code
- Include API specifications
- Document deployment procedures
- Maintain development guidelines

#### Configuration (`/config`)
- Centralize configuration files
- Use environment-specific configs
- Document configuration options
- Keep sensitive data in environment variables

### Best Practices
1. **Naming Conventions**
   - Use kebab-case for directories
   - Use PascalCase for components
   - Use camelCase for functions and variables
   - Use UPPER_CASE for constants

2. **File Organization**
   - Keep related files together
   - Use index files for clean exports
   - Follow the principle of least surprise
   - Maintain consistent structure across modules

3. **Code Splitting**
   - Split code by feature or module
   - Keep files focused and small
   - Use lazy loading where appropriate
   - Maintain clear dependencies

4. **Asset Management**
   - Organize assets by type
   - Use appropriate compression
   - Implement caching strategies
   - Follow naming conventions
