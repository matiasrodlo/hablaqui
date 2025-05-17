# Frontend Documentation

## Overview
The Hablaquí landing page and web application is built using Nuxt.js (Vue.js), providing a modern, responsive, and SEO-optimized user interface.

## Architecture

### Directory Structure
```
landing/
├── components/
│   ├── common/       # Shared components
│   ├── layout/       # Layout components
│   ├── sections/     # Page sections
│   ├── auth/         # Authentication
│   ├── chat/         # Chat interface
│   ├── dashboard/    # Dashboard components
│   └── evaluation/   # Evaluation forms
├── pages/           # Vue pages
├── assets/          # Static assets
│   ├── images/      # Image files
│   ├── styles/      # CSS/SCSS files
│   └── fonts/       # Font files
├── plugins/         # Nuxt plugins
├── store/           # Vuex store
└── utils/           # Utility functions
```

## Key Components

### Common Components
- AppbarBlue: Blue navigation bar
- AppbarClean: Clean navigation bar
- AppbarWhite: White navigation bar
- Avatar: User avatar component
- Calendar: Appointment calendar
- Footer: Page footer
- Icon: Custom icon component
- Snackbar: Notification component

### Layout Components
- Default layout
- Auth layout
- Dashboard layout
- Specialist layout

### Feature Components
- Authentication forms
- Chat interface
- Dashboard widgets
- Evaluation forms
- Specialist profiles

## Features

### Authentication
- User registration
- Login/Logout
- Password recovery
- Social authentication

### Dashboard
- Appointment management
- Profile settings
- Payment history
- Notifications

### Specialist Features
- Profile management
- Availability calendar
- Session management
- Payment tracking

### Chat System
- Real-time messaging
- File sharing
- Message history
- Online status

## State Management

### Vuex Store
- User state
- Authentication
- Appointments
- Messages
- Settings

### Data Flow
- Actions
- Mutations
- Getters
- Modules

## UI/UX Design

### Theme
- Color system
- Typography
- Spacing
- Components

### Responsive Design
- Mobile-first approach
- Breakpoints
- Grid system
- Flexible layouts

## Dependencies

### Core
- Nuxt.js
- Vue.js
- Vuex
- Vue Router

### UI Libraries
- Vuetify
- Material Design Icons
- Vue Carousel
- Vue Calendar

### Utilities
- Axios
- Moment.js
- Lodash
- Pusher

## Development

### Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

### Building
```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Testing
```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e
```

## SEO Optimization

### Meta Tags
- Title
- Description
- Keywords
- Open Graph

### Performance
- Image optimization
- Code splitting
- Lazy loading
- Caching

## Security

### Authentication
- JWT handling
- Session management
- CSRF protection
- XSS prevention

### Data Protection
- Input validation
- Sanitization
- Secure storage
- API security

## Deployment

### Google Cloud Platform
- App Engine deployment
- SSL configuration
- Domain setup
- CDN integration

### CI/CD
- Automated builds
- Testing
- Deployment
- Monitoring

## Monitoring

### Analytics
- Google Analytics
- User tracking
- Performance metrics
- Error tracking

### Error Handling
- Error boundaries
- Logging
- Reporting
- Debugging

## Accessibility

### Features
- ARIA labels
- Keyboard navigation
- Screen readers
- Color contrast

### Compliance
- WCAG 2.1
- ADA compliance
- Section 508
- International standards

## Internationalization

### Features
- Multi-language support
- RTL support
- Date formatting
- Number formatting

### Implementation
- i18n module
- Language files
- Dynamic loading
- Fallback handling 