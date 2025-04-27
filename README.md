# Hablaquí

A mental health marketplace and SaaS platform connecting users with a network of over 200 certified specialists.

## 🎥 Demo
[Watch on YouTube](https://www.youtube.com/watch?v=3OhoPxWkAcM)

## 🏗️ Architecture
The project consists of three main components:

### Backend API (`/api`)
- Node.js-based REST API
- Docker containerization
- Development and production environments
- ESLint for code quality

### Mobile App (`/movil`)
- Flutter-based cross-platform application
- Supports iOS and Android
- Web version available
- Comprehensive test coverage

### Landing Page (`/landing`)
- Nuxt.js (Vue.js) based frontend
- Modern component architecture
- Responsive design
- SEO optimized

## 🚀 Getting Started

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
npm run dev
```

## 📦 Project Structure
```
hablaqui/
├── api/                 # Backend API service
├── movil/              # Flutter mobile application
├── landing/            # Nuxt.js landing page
├── images/             # Shared images
└── .github/            # GitHub Actions workflows
```

The project was developed during university studies and has been incubated by Digevo Ventures and accelerated by Start-Up Chile.