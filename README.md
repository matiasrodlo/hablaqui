![image](https://github.com/user-attachments/assets/aa68a627-647a-4ec2-b814-58ddb9c0f82b)

# Hablaquí

A mental health marketplace and SaaS platform connecting users with a network of over 200 certified specialists. The platform facilitates scheduling, payments, and secure video consultations.

Hablaquí was born at the Startup School of Adolfo Ibáñez University and was later incubated by Digevo Ventures, accelerated through Start-Up Chile, and backed by Google for Startups.

[Watch Product Demo](https://www.youtube.com/watch?v=3OhoPxWkAcM)

## Quick Start

### Prerequisites
- Node.js (v14+)
- Flutter SDK
- Docker & Docker Compose

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/hablaqui.git
cd hablaqui

# Backend
cd api && npm install && cd ..

# Mobile
cd movil && flutter pub get && cd ..

# Frontend
cd landing && npm install && cd ..
```

### Development

```bash
# Backend
cd api && npm run dev

# Frontend
cd landing && npm run dev

# Mobile
cd movil && flutter run
```

## Structure

```
hablaqui/
├── api/          # Backend API (Express.js)
├── landing/      # Frontend (Nuxt.js)
├── movil/        # Mobile app (Flutter)
├── docs/         # Documentation
├── docker/       # Docker configs
└── scripts/      # Deployment scripts
```

## Documentation

- [API Documentation](docs/API.md)
- [Server Implementation](api/server/README.md)
- [Mobile App](movil/README.md)
- [Frontend](landing/README.md)

## Environment

Create `.env` files in `api/` and `landing/` with required environment variables. See each component's README for details.

---

Built with ❤️ Remotly
