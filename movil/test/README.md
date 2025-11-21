# Testing Documentation

This directory contains all test files for the Hablaqui mobile application. The testing strategy follows a comprehensive approach covering unit tests, widget tests, and integration tests.

## Directory Structure

```
test/
├── unit/                 # Unit tests
│   ├── core/            # Core functionality tests
│   ├── data/            # Data layer tests
│   ├── domain/          # Domain layer tests
│   └── utils/           # Utility function tests
│
├── widget/              # Widget tests
│   ├── pages/          # Page widget tests
│   └── components/     # Component widget tests
│
├── integration/         # Integration tests
│   ├── flows/          # User flow tests
│   └── scenarios/      # Test scenarios
│
└── helpers/            # Test helpers and utilities
    ├── mocks/          # Mock implementations
    ├── fixtures/       # Test data fixtures
    └── matchers/       # Custom test matchers
```

## Testing Strategy

### Unit Tests
- Test individual functions and classes
- Focus on business logic
- Use mocks for dependencies
- Aim for high coverage

### Widget Tests
- Test UI components
- Verify widget behavior
- Test user interactions
- Check widget rendering

### Integration Tests
- Test complete features
- Verify system integration
- Test user flows
- Ensure system stability

## Test Categories

### Core Tests
- Error handling
- Network utilities
- Storage operations
- Utility functions

### Data Layer Tests
- Repository implementations
- Data source operations
- Model transformations
- Cache management

### Domain Layer Tests
- Use case implementations
- Business logic
- Entity operations
- Validation rules

### Presentation Layer Tests
- BLoC state management
- Page navigation
- User interactions
- UI state changes

## Testing Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive names
   - Follow AAA pattern
   - Keep tests focused

2. **Test Data**
   - Use fixtures
   - Create test factories
   - Maintain test data
   - Use meaningful data

3. **Mocking**
   - Mock external dependencies
   - Use proper test doubles
   - Verify interactions
   - Keep mocks simple

4. **Assertions**
   - Use specific assertions
   - Test edge cases
   - Verify side effects
   - Check error cases

## Running Tests

### All Tests
```bash
flutter test
```

### Specific Test File
```bash
flutter test test/unit/core/network_test.dart
```

### With Coverage
```bash
flutter test --coverage
```

### Watch Mode
```bash
flutter test --watch
```

## Test Coverage

Maintain minimum coverage requirements:
- Unit tests: 80%
- Widget tests: 70%
- Integration tests: 50%

## Continuous Integration

Tests are run automatically:
- On every pull request
- Before merging to main
- On scheduled basis
- After deployment

## Test Maintenance

1. **Regular Updates**
   - Update test data
   - Review test coverage
   - Update mocks
   - Fix failing tests

2. **Documentation**
   - Document test cases
   - Update test README
   - Document test data
   - Maintain test helpers

3. **Review Process**
   - Review test coverage
   - Verify test quality
   - Check test organization
   - Validate test data

## Common Test Patterns

### BLoC Testing
```dart
test('should emit [Loading, Success] when data is fetched', () {
  // Arrange
  final bloc = MyBloc();
  
  // Act
  bloc.add(FetchData());
  
  // Assert
  expectLater(
    bloc.stream,
    emitsInOrder([Loading(), Success(data)]),
  );
});
```

### Widget Testing
```dart
testWidgets('should display error message', (tester) async {
  // Arrange
  await tester.pumpWidget(MyWidget());
  
  // Act
  await tester.tap(find.byType(ErrorButton));
  await tester.pump();
  
  // Assert
  expect(find.text('Error occurred'), findsOneWidget);
});
```

### Integration Testing
```dart
test('should complete user flow', () async {
  // Arrange
  final app = await startApp();
  
  // Act
  await app.login();
  await app.navigateToProfile();
  await app.updateProfile();
  
  // Assert
  expect(app.isProfileUpdated(), isTrue);
});
```

## Troubleshooting

Common issues and solutions:
1. **Flaky Tests**
   - Add proper waits
   - Use proper matchers
   - Handle async operations
   - Clean up resources

2. **Slow Tests**
   - Optimize test data
   - Use proper mocks
   - Reduce setup time
   - Parallelize tests

3. **Test Failures**
   - Check test data
   - Verify mocks
   - Review assertions
   - Check environment

## Resources

- [Flutter Testing Documentation](https://flutter.dev/docs/testing)
- [Dart Testing Package](https://pub.dev/packages/test)
- [Mockito Package](https://pub.dev/packages/mockito)
- [Flutter Test Package](https://pub.dev/packages/flutter_test) 