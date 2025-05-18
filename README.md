![image](https://github.com/user-attachments/assets/aa68a627-647a-4ec2-b814-58ddb9c0f82b)

# Hablaquí

A mental health marketplace and SaaS platform connecting users with a network of over 200 certified specialists. The platform facilitates scheduling, payments, and secure video consultations.

Hablaquí was born at the Startup School of Adolfo Ibáñez University and was later incubated by Digevo Ventures, accelerated through Start-Up Chile, and backed by Google for Startups.

[Watch Product Demo](https://www.youtube.com/watch?v=3OhoPxWkAcM)

## Documentation Structure

### Core Components

1. **Backend API** (`/api`)
   - [API Documentation](docs/API.md)
   - [Server Implementation](api/server/README.md)
   - [Testing Guide](api/tests/README.md)

2. **Mobile Application** (`/movil`)
   - [Mobile App Documentation](movil/README.md)
   - [Flutter Implementation](movil/lib/README.md)
   - [Testing Guide](movil/test/README.md)

3. **Landing Page** (`/landing`)
   - [Frontend Documentation](landing/README.md)
   - [Component Library](landing/components/README.md)
   - [Deployment Guide](landing/docs/deployment.md)

### Development Resources

- [Getting Started Guide](docs/README.md#getting-started)
- [Development Guidelines](docs/README.md#development-guidelines)
- [Deployment Guide](docs/README.md#deployment)
- [Package Management](docs/PACKAGE_JSON.md)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Flutter SDK
- Docker and Docker Compose
- Google Cloud SDK

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
# Create .env file with required environment variables
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
# Create .env file with required environment variables
npm run dev
```

## Project Structure

```
hablaqui/
├── api/                      # Backend API service
│   ├── server/              # Server implementation
│   ├── tests/              # API tests
│   └── docs/               # API documentation
│
├── movil/                   # Flutter mobile application
│   ├── lib/                # Dart source code
│   ├── test/              # Mobile app tests
│   └── docs/              # Mobile documentation
│
├── landing/                # Nuxt.js landing page
│   ├── components/        # Vue components
│   ├── pages/            # Vue pages
│   └── docs/             # Frontend documentation
│
├── docs/                  # Project documentation
│   ├── API.md            # API documentation
│   ├── PACKAGE_JSON.md   # Package management
│   └── README.md         # Documentation guide
│
└── scripts/              # Build and utility scripts
```

## Development Guidelines

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
```

2. Frontend (`landing/.env`):
```env
API_ABSOLUTE=your_api_url
FRONTEND_URL=your_frontend_url
```

## Deployment
The application is deployed to Google Cloud Platform:
- Frontend landing page: www.hablaqui.cl
- Backend API: api.hablaqui.cl
- Deployment is managed through Cloud Build
- Routing is configured in dispatch.yaml

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support:
- Create an issue in the repository
- Contact the development team
- Join our Slack channel

## License

This project is private and confidential.

---

Built with ❤️ Remotly