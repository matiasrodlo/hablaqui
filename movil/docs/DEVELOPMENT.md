# Development Guidelines

## Code Style

### Naming Conventions
- Use `camelCase` for variables and methods
- Use `PascalCase` for classes and types
- Use `snake_case` for file names
- Prefix private members with underscore
- Use descriptive names

### File Organization
- One class per file
- Group related files in directories
- Keep files focused and small
- Use meaningful file names

### Code Formatting
- Use 2 spaces for indentation
- Maximum line length: 80 characters
- Use trailing commas
- Sort imports alphabetically

## State Management

### Provider Pattern
```dart
class UserProvider extends ChangeNotifier {
  User? _user;
  User? get user => _user;

  Future<void> loadUser() async {
    _user = await _userRepository.getUser();
    notifyListeners();
  }
}
```

### BLoC Pattern
```dart
class UserBloc extends Bloc<UserEvent, UserState> {
  final UserRepository _repository;

  UserBloc(this._repository) : super(UserInitial()) {
    on<LoadUser>(_onLoadUser);
  }

  Future<void> _onLoadUser(LoadUser event, Emitter<UserState> emit) async {
    emit(UserLoading());
    try {
      final user = await _repository.getUser();
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}
```

## Testing

### Unit Tests
```dart
void main() {
  group('UserRepository', () {
    late UserRepository repository;
    late MockApiClient mockApiClient;

    setUp(() {
      mockApiClient = MockApiClient();
      repository = UserRepositoryImpl(mockApiClient);
    });

    test('should return user when API call is successful', () async {
      when(mockApiClient.get(any)).thenAnswer((_) async => 
        Response(data: {'id': '1', 'name': 'Test'}));

      final user = await repository.getUser('1');
      expect(user.id, equals('1'));
      expect(user.name, equals('Test'));
    });
  });
}
```

### Widget Tests
```dart
void main() {
  testWidgets('should display user profile', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: UserProfilePage(user: User(id: '1', name: 'Test')),
      ),
    );

    expect(find.text('Test'), findsOneWidget);
    expect(find.byType(ProfileHeader), findsOneWidget);
  });
}
```

## Error Handling

### Try-Catch Blocks
```dart
Future<void> loadData() async {
  try {
    final data = await _repository.getData();
    _handleSuccess(data);
  } on NetworkError catch (e) {
    _handleNetworkError(e);
  } on ValidationError catch (e) {
    _handleValidationError(e);
  } catch (e) {
    _handleGenericError(e);
  }
}
```

### Error Boundaries
```dart
class ErrorBoundary extends StatelessWidget {
  final Widget child;
  final Widget Function(BuildContext, FlutterErrorDetails)? errorBuilder;

  const ErrorBoundary({
    Key? key,
    required this.child,
    this.errorBuilder,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ErrorWidget.builder = (FlutterErrorDetails details) {
      return errorBuilder?.call(context, details) ?? 
        DefaultErrorWidget(details: details);
    };
  }
}
```

## Performance

### Widget Optimization
- Use `const` constructors
- Implement `shouldRebuild`
- Use `ListView.builder`
- Avoid unnecessary rebuilds

### Memory Management
- Dispose controllers
- Cancel subscriptions
- Clear caches
- Handle image memory

## Security

### Data Protection
```dart
class SecureStorage {
  final FlutterSecureStorage _storage;

  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }
}
```

### Input Validation
```dart
class InputValidator {
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
      return 'Invalid email format';
    }
    return null;
  }
}
```

## Documentation

### Code Comments
- Document public APIs
- Explain complex logic
- Use TODO comments
- Keep comments up to date

### API Documentation
```dart
/// A class that manages user authentication.
///
/// This class handles user login, registration, and session management.
/// It uses secure storage for token management and provides methods
/// for checking authentication status.
class AuthManager {
  /// Authenticates a user with the provided credentials.
  ///
  /// Returns a [User] object if authentication is successful.
  /// Throws [AuthenticationError] if credentials are invalid.
  Future<User> login(String email, String password) async {
    // Implementation
  }
}
```

## Version Control

### Git Workflow
1. Create feature branch
2. Make changes
3. Write tests
4. Update documentation
5. Create pull request

### Commit Messages
- Use present tense
- Start with verb
- Keep it concise
- Reference issues

## Related Documentation
- [Architecture](ARCHITECTURE.md)
- [Error Handling](core/ERROR_HANDLING.md)
- [Network Layer](core/NETWORK.md)
- [Storage System](core/STORAGE.md) 