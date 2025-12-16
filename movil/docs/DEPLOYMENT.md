# Deployment Guide

## Overview
This guide covers the process of building and deploying the Hablaqui mobile application for both Android and iOS platforms.

## Prerequisites

### Android
- Android Studio
- JDK 11 or higher
- Android SDK
- Keystore for signing

### iOS
- Xcode 13 or higher
- macOS
- Apple Developer Account
- Certificates and provisioning profiles

## Build Configuration

### Environment Setup
```bash
# Development
flutter run --flavor development

# Staging
flutter run --flavor staging

# Production
flutter run --flavor production
```

### Build Types
- Debug: For development and testing
- Profile: For performance testing
- Release: For production deployment

## Android Deployment

### Build Process
1. Update version in `pubspec.yaml`
2. Generate release build:
```bash
flutter build appbundle --flavor production
```

### Signing Configuration
```gradle
android {
    signingConfigs {
        release {
            storeFile file("keystore.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
}
```

### Google Play Store
1. Create release in Play Console
2. Upload app bundle
3. Configure release notes
4. Submit for review

## iOS Deployment

### Build Process
1. Update version in Xcode
2. Generate archive:
```bash
flutter build ios --flavor production
```

### Signing Configuration
1. Open Xcode
2. Select project
3. Configure signing & capabilities
4. Set up provisioning profiles

### App Store
1. Create app in App Store Connect
2. Upload build
3. Configure metadata
4. Submit for review

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter test
      - run: flutter build appbundle
```

### Fastlane
```ruby
platform :android do
  desc "Deploy to Play Store"
  lane :deploy do
    gradle(task: "clean assembleRelease")
    upload_to_play_store
  end
end
```

## Environment Configuration

### Development
```dart
class Environment {
  static const apiUrl = 'https://dev-api.hablaqui.com';
  static const wsUrl = 'wss://dev-ws.hablaqui.com';
}
```

### Production
```dart
class Environment {
  static const apiUrl = 'https://api.hablaqui.com';
  static const wsUrl = 'wss://ws.hablaqui.com';
}
```

## Release Process

### Version Management
1. Update version in `pubspec.yaml`
2. Update build number
3. Update changelog
4. Tag release in git

### Release Checklist
- [ ] Update version numbers
- [ ] Run all tests
- [ ] Check performance
- [ ] Verify security
- [ ] Update documentation
- [ ] Create release notes
- [ ] Build release version
- [ ] Test release build
- [ ] Deploy to stores

## Monitoring

### Crash Reporting
```dart
void initializeCrashReporting() {
  FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(true);
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;
}
```

### Analytics
```dart
void initializeAnalytics() {
  FirebaseAnalytics.instance.setAnalyticsCollectionEnabled(true);
}
```

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check dependencies
   - Verify signing
   - Check environment
   - Review logs

2. **Deployment Issues**
   - Verify credentials
   - Check store listings
   - Review guidelines
   - Contact support

3. **Performance Issues**
   - Run performance tests
   - Check memory usage
   - Optimize assets
   - Review code

## Related Documentation
- [Architecture](ARCHITECTURE.md)
- [Development Guidelines](DEVELOPMENT.md)
- [Error Handling](core/ERROR_HANDLING.md)
- [Network Layer](core/NETWORK.md) 