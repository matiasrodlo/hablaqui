# Routing System

## Overview
The `AppRouter` class manages navigation and routing throughout the application. It provides a centralized way to handle navigation, route parameters, and transitions between screens.

## Key Features
- Centralized route management
- Type-safe navigation
- Route parameter handling
- Transition animations
- Deep linking support
- Error handling

## Route Definitions

### Route Names
```dart
class AppRouter {
  static const String home = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String profile = '/profile';
  static const String sessions = '/sessions';
  static const String specialists = '/specialists';
  static const String settings = '/settings';
}
```

### Route Generation
```dart
static Route<dynamic> onGenerateRoute(RouteSettings settings) {
  switch (settings.name) {
    case home:
      return MaterialPageRoute(builder: (_) => const HomePage());
    case login:
      return MaterialPageRoute(builder: (_) => const LoginPage());
    // ... other routes
  }
}
```

## Navigation Methods

### Basic Navigation
```dart
// Navigate to a new screen
AppRouter.navigateToHome(context);
AppRouter.navigateToLogin(context);
AppRouter.navigateToProfile(context);
```

### Navigation with Parameters
```dart
// Navigate with parameters
AppRouter.navigateToSession(context, sessionId: '123');
AppRouter.navigateToSpecialist(context, specialistId: '456');
```

### Navigation with Replacement
```dart
// Replace current screen
AppRouter.replaceWithHome(context);
AppRouter.replaceWithLogin(context);
```

### Navigation with Clear Stack
```dart
// Clear navigation stack
AppRouter.clearAndNavigateToHome(context);
AppRouter.clearAndNavigateToLogin(context);
```

## Route Parameters

### Parameter Handling
```dart
// In route generation
case '/session/:id':
  final sessionId = settings.arguments as String;
  return MaterialPageRoute(
    builder: (_) => SessionPage(sessionId: sessionId),
  );
```

### Parameter Passing
```dart
// When navigating
AppRouter.navigateToSession(context, sessionId: '123');

// Using arguments
Navigator.pushNamed(context, '/session/123');
```

## Transitions

### Custom Transitions
```dart
static Route<dynamic> _buildRoute(Widget page) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  );
}
```

### Transition Types
- Fade transition
- Slide transition
- Scale transition
- Custom transitions

## Deep Linking

### URL Handling
```dart
// Handle deep links
static Future<void> handleDeepLink(String url) async {
  final uri = Uri.parse(url);
  switch (uri.path) {
    case '/session':
      final sessionId = uri.queryParameters['id'];
      // Navigate to session
      break;
    // ... other cases
  }
}
```

### Deep Link Configuration
```dart
// In AndroidManifest.xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="hablaqui" />
</intent-filter>
```

## Error Handling

### Unknown Routes
```dart
// Handle unknown routes
case _:
  return MaterialPageRoute(
    builder: (_) => const NotFoundPage(),
  );
```

### Navigation Errors
```dart
try {
  await AppRouter.navigateToPage(context);
} catch (e) {
  // Handle navigation error
  ErrorHandler.handleError(e);
}
```

## Best Practices

1. **Route Organization**
   - Keep routes centralized
   - Use meaningful names
   - Document route parameters

2. **Navigation Patterns**
   - Use type-safe navigation
   - Handle back navigation
   - Manage navigation stack

3. **Parameter Handling**
   - Validate parameters
   - Use type-safe parameters
   - Handle missing parameters

4. **Performance**
   - Lazy load routes
   - Optimize transitions
   - Cache route data

## Testing

### Route Tests
```dart
void main() {
  testWidgets('should navigate to home', (tester) async {
    await tester.pumpWidget(const MyApp());
    await AppRouter.navigateToHome(tester.element(find.byType(MyApp)));
    expect(find.byType(HomePage), findsOneWidget);
  });
}
```

### Deep Link Tests
```dart
void main() {
  test('should handle deep link', () async {
    await AppRouter.handleDeepLink('hablaqui://session?id=123');
    // Verify navigation
  });
}
```

## Maintenance

### Adding New Routes
1. Add route constant
2. Add navigation method
3. Update route generation
4. Add tests

### Updating Routes
1. Update route definition
2. Update navigation methods
3. Update documentation
4. Update tests

### Removing Routes
1. Remove route constant
2. Remove navigation method
3. Update documentation
4. Update tests

## Troubleshooting

### Common Issues
1. **Navigation Not Working**
   - Check route name
   - Verify context
   - Check navigation stack

2. **Parameter Issues**
   - Verify parameter type
   - Check parameter passing
   - Validate parameters

3. **Deep Link Problems**
   - Check URL scheme
   - Verify intent filters
   - Test deep link handling

## Related Documentation
- [App Configuration](APP_CONFIG.md)
- [Error Handling](ERROR_HANDLING.md)
- [Navigation Patterns](../patterns/NAVIGATION.md) 