# Architecture

## Overview
Hablaqui follows a clean architecture approach with a focus on maintainability, scalability, and testability. The app is structured in layers, each with specific responsibilities and dependencies.

## Architecture Layers

### Presentation Layer
- **Pages**: UI screens and widgets
- **Controllers**: State management and business logic
- **Models**: UI-specific data models
- **Widgets**: Reusable UI components

### Domain Layer
- **Entities**: Core business objects
- **Use Cases**: Application-specific business rules
- **Repositories**: Abstract interfaces for data operations

### Data Layer
- **Repositories**: Implementation of repository interfaces
- **Data Sources**: Local and remote data providers
- **Models**: Data transfer objects (DTOs)

## Key Components

### State Management
- Uses Provider for state management
- Implements BLoC pattern for complex state
- Maintains unidirectional data flow

### Dependency Injection
- Manual dependency injection
- Service locator pattern
- Lazy initialization

### Error Handling
- Centralized error handling
- Custom error types
- Error boundaries

### Network Layer
- RESTful API communication
- Request/response interceptors
- Caching mechanism

### Storage
- Local storage (Hive)
- Secure storage
- Cache management

## Design Patterns

### Repository Pattern
```dart
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<void> updateUser(User user);
  Future<void> deleteUser(String id);
}

class UserRepositoryImpl implements UserRepository {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  UserRepositoryImpl(this._apiClient, this._localStorage);

  @override
  Future<User> getUser(String id) async {
    try {
      final response = await _apiClient.get('/users/$id');
      return User.fromJson(response.data);
    } catch (e) {
      final cachedUser = await _localStorage.get('user_$id');
      if (cachedUser != null) {
        return User.fromJson(cachedUser);
      }
      rethrow;
    }
  }
}
```

### Factory Pattern
```dart
class ApiClientFactory {
  static ApiClient create() {
    final dio = Dio();
    final cacheManager = CacheManager();
    return ApiClient(dio: dio, cacheManager: cacheManager);
  }
}
```

### Observer Pattern
```dart
class SessionManager extends ChangeNotifier {
  Session? _currentSession;
  
  Session? get currentSession => _currentSession;

  void updateSession(Session session) {
    _currentSession = session;
    notifyListeners();
  }
}
```

## Code Organization

### Feature-based Structure
```
lib/
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   ├── controllers/
│   │   └── models/
│   ├── profile/
│   │   ├── pages/
│   │   ├── controllers/
│   │   └── models/
│   └── sessions/
│       ├── pages/
│       ├── controllers/
│       └── models/
```

### Core Module Structure
```
lib/
├── core/
│   ├── error/
│   ├── network/
│   ├── storage/
│   └── utils/
```

## Best Practices

### Code Style
- Follow Flutter style guide
- Use meaningful names
- Keep functions small
- Write documentation

### Testing
- Unit tests for business logic
- Widget tests for UI
- Integration tests for features
- Mock external dependencies

### Performance
- Lazy loading
- Image optimization
- Memory management
- Background processing

## Security

### Data Protection
- Secure storage for sensitive data
- API key management
- Input validation
- Output sanitization

### Authentication
- Token-based auth
- Biometric authentication
- Session management
- Secure communication

## Scalability

### Horizontal Scaling
- Stateless components
- Caching strategy
- Load balancing
- Resource optimization

### Vertical Scaling
- Code modularity
- Feature flags
- Configuration management
- Performance monitoring

## Related Documentation
- [Development Guidelines](DEVELOPMENT.md)
- [Error Handling](core/ERROR_HANDLING.md)
- [Network Layer](core/NETWORK.md)
- [Storage System](core/STORAGE.md) 