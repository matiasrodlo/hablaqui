# Mobile App Documentation

## Overview
The Hablaquí mobile app is built using Flutter, providing a cross-platform solution for iOS and Android. The app enables users to schedule appointments, conduct video consultations, and manage their mental health journey.

## Architecture

### Directory Structure
```
movil/
├── lib/
│   ├── screens/       # UI screens
│   ├── widgets/       # Reusable components
│   ├── models/        # Data models
│   ├── services/      # API services
│   ├── utils/         # Helper functions
│   ├── helpers/       # Utility classes
│   ├── pages/         # Page components
│   └── classes/       # Business logic classes
├── android/          # Android platform code
├── ios/             # iOS platform code
└── web/             # Web platform code
```

## Key Components

### Screens
- Authentication screens
- Appointment scheduling
- Video consultation
- Profile management
- Specialist discovery

### Widgets
- Custom UI components
- Reusable elements
- Platform-specific adaptations

### Services
- API communication
- Authentication
- Payment processing
- Push notifications

## Features

### Authentication
- Email/password login
- Social authentication
- Session management
- Password recovery

### Appointment Management
- Calendar integration
- Availability checking
- Booking confirmation
- Reminder notifications

### Video Consultations
- Real-time video calls
- Chat functionality
- Screen sharing
- Recording options

### Payment Processing
- Secure payment flow
- Transaction history
- Receipt generation
- Refund handling

## State Management
- Provider pattern
- Local storage
- State persistence
- Data synchronization

## UI/UX Design

### Theme
- Material Design implementation
- Custom color scheme
- Typography system
- Responsive layouts

### Navigation
- Bottom navigation
- Stack navigation
- Deep linking
- Route management

## Dependencies

### Core Packages
- flutter_pusher: Real-time features
- http: API communication
- shared_preferences: Local storage
- intl: Internationalization
- url_launcher: External links

### UI Packages
- carousel_slider: UI components
- flutter_svg: SVG support
- cached_network_image: Image caching
- flutter_spinkit: Loading animations

## Development

### Setup
1. Install Flutter SDK
2. Install dependencies:
```bash
flutter pub get
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Run the app:
```bash
flutter run
```

### Testing
```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/widget_test.dart
```

### Building
```bash
# Android
flutter build apk

# iOS
flutter build ios

# Web
flutter build web
```

## Platform-Specific Features

### Android
- Push notifications
- Background services
- File system access
- Camera integration

### iOS
- Face ID/Touch ID
- Push notifications
- Photo library access
- Background modes

### Web
- Responsive design
- PWA support
- Browser compatibility
- Offline support

## Performance

### Optimization
- Image optimization
- Lazy loading
- Memory management
- Battery efficiency

### Caching
- API response caching
- Image caching
- Offline data
- State persistence

## Security

### Data Protection
- Secure storage
- Network security
- Input validation
- Error handling

### Authentication
- Token management
- Biometric auth
- Session handling
- Secure communication

## Deployment

### Android
- Google Play Store
- Release signing
- Version management
- Update handling

### iOS
- App Store
- Certificates
- Provisioning
- Review process

## Monitoring

### Analytics
- User behavior
- Performance metrics
- Error tracking
- Usage statistics

### Crash Reporting
- Error logging
- Stack traces
- User feedback
- Issue tracking

## Accessibility

### Features
- Screen readers
- Dynamic text
- Color contrast
- Keyboard navigation

### Guidelines
- WCAG compliance
- Platform standards
- User testing
- Feedback integration 