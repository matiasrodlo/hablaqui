# App Configuration

## Overview
The `AppConfig` class manages application-wide configuration settings, environment variables, and feature flags. It provides a centralized way to access and manage app settings throughout the application.

## Key Features
- Environment-specific configuration
- API endpoint management
- Feature flag system
- Version control
- Firebase configuration
- Analytics setup
- Logging configuration

## Configuration Properties

### API Configuration
```dart
static String get apiBaseUrl => _apiBaseUrl;
static String get wsUrl => _wsUrl;
```
- `apiBaseUrl`: Base URL for REST API calls
- `wsUrl`: WebSocket URL for real-time communication

### Environment Settings
```dart
static String get environment => _environment;
static String get version => _version;
static String get buildNumber => _buildNumber;
```
- `environment`: Current environment (development/staging/production)
- `version`: App version number
- `buildNumber`: Build number for versioning

### Feature Flags
```dart
static Map<String, bool> get featureFlags => _featureFlags;
```
Manages feature toggles for:
- Dark mode
- Push notifications
- Video calls
- File sharing
- Offline mode

## Initialization

### Basic Setup
```dart
void main() async {
  await AppConfig.initialize();
  // ... rest of initialization
}
```

### Environment Variables
The system loads environment variables from secure storage:
```dart
static Future<void> _loadEnvironmentVariables() async {
  final storage = StorageManager.instance;
  _environment = await storage.getString('environment') ?? 'development';
  _version = await storage.getString('version') ?? '1.0.0';
  _buildNumber = await storage.getString('buildNumber') ?? '1';
}
```

## API Endpoints

### Production
```dart
_apiBaseUrl = 'https://api.hablaqui.com';
_wsUrl = 'wss://ws.hablaqui.com';
```

### Staging
```dart
_apiBaseUrl = 'https://staging-api.hablaqui.com';
_wsUrl = 'wss://staging-ws.hablaqui.com';
```

### Development
```dart
_apiBaseUrl = 'http://localhost:3000';
_wsUrl = 'ws://localhost:3001';
```

## Feature Management

### Checking Feature Status
```dart
bool isEnabled = AppConfig.isFeatureEnabled('enableDarkMode');
```

### Available Features
- `enableDarkMode`: Toggle dark theme
- `enablePushNotifications`: Push notification support
- `enableVideoCalls`: Video call functionality
- `enableFileSharing`: File sharing capabilities
- `enableOfflineMode`: Offline functionality

## Environment Detection

### Production Check
```dart
bool isProd = AppConfig.isProduction();
```

### Development Check
```dart
bool isDev = AppConfig.isDevelopment();
```

## Best Practices

1. **Configuration Access**
   - Always use getter methods to access configuration
   - Never modify configuration values directly
   - Use type-safe access methods

2. **Feature Flags**
   - Keep feature flags organized by category
   - Document new feature flags
   - Remove unused feature flags

3. **Environment Management**
   - Use environment-specific configurations
   - Validate environment variables
   - Handle missing configurations gracefully

4. **Security**
   - Store sensitive data in secure storage
   - Validate configuration values
   - Implement proper error handling

## Error Handling

### Configuration Errors
```dart
try {
  await AppConfig.initialize();
} catch (e) {
  // Handle initialization error
  ErrorHandler.handleError(e);
}
```

### Missing Configuration
```dart
final value = await storage.getString('key') ?? defaultValue;
```

## Testing

### Unit Tests
```dart
void main() {
  group('AppConfig', () {
    test('should initialize with default values', () async {
      await AppConfig.initialize();
      expect(AppConfig.environment, equals('development'));
    });
  });
}
```

### Integration Tests
```dart
void main() {
  integrationTest('should load environment variables', (tester) async {
    await AppConfig.initialize();
    expect(AppConfig.apiBaseUrl, isNotEmpty);
  });
}
```

## Maintenance

### Adding New Configuration
1. Add new property with getter
2. Initialize in `_initializeSettings()`
3. Add to documentation
4. Update tests

### Updating Configuration
1. Update property value
2. Validate changes
3. Update documentation
4. Run tests

### Removing Configuration
1. Remove property
2. Update initialization
3. Update documentation
4. Update tests

## Troubleshooting

### Common Issues
1. **Configuration Not Loading**
   - Check storage permissions
   - Verify initialization order
   - Check error logs

2. **Feature Flags Not Working**
   - Verify flag name
   - Check initialization
   - Validate storage

3. **Environment Issues**
   - Verify environment variable
   - Check storage access
   - Validate configuration

## Related Documentation
- [Storage System](STORAGE.md)
- [Error Handling](ERROR_HANDLING.md)
- [Network Layer](NETWORK.md) 