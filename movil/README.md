# Hablaqui Mobile App

A Flutter-based mobile application for the Hablaqui platform, providing a seamless experience for users to connect with language specialists.

## Features

- **User Authentication**
  - Secure login and registration
  - Social media integration
  - Password recovery
  - Session management

- **Specialist Discovery**
  - Browse available specialists
  - Filter by language, expertise, and availability
  - View detailed profiles
  - Real-time availability status

- **Booking System**
  - Schedule sessions with specialists
  - Calendar integration
  - Session reminders
  - Payment processing

- **Communication**
  - In-app messaging
  - Video call integration
  - File sharing
  - Push notifications

- **Progress Tracking**
  - Learning goals
  - Session history
  - Progress reports
  - Achievement badges

## Getting Started

### Prerequisites

- Flutter SDK (2.0.0 or higher)
- Dart SDK (2.12.0 or higher)
- Android Studio / Xcode
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hablaqui-mobile.git
   cd hablaqui-mobile
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

```
movil/
├── android/          # Android-specific files
├── ios/             # iOS-specific files
├── lib/             # Dart source code
│   ├── config/      # App configuration
│   ├── models/      # Data models
│   ├── screens/     # UI screens
│   ├── services/    # API services
│   ├── utils/       # Utility functions
│   └── widgets/     # Reusable widgets
├── test/            # Test files
├── web/             # Web-specific files
└── images/          # Asset images
```

## Development

### Code Style

- Follow the [Dart style guide](https://dart.dev/guides/language/effective-dart/style)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

Run tests:
```bash
flutter test
```

### Building

#### Android
```bash
flutter build apk --release
```

#### iOS
```bash
flutter build ios --release
```

## Dependencies

Key dependencies include:
- `flutter_bloc` for state management
- `dio` for HTTP requests
- `shared_preferences` for local storage
- `flutter_secure_storage` for secure storage
- `intl` for internationalization
- `camera` for video calls
- `firebase_messaging` for push notifications

See `pubspec.yaml` for complete list.

## Environment Variables

Required environment variables:
```env
API_URL=https://api.hablaqui.com
FIREBASE_API_KEY=your-firebase-key
STRIPE_PUBLIC_KEY=your-stripe-key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@hablaqui.com or join our Slack channel.
