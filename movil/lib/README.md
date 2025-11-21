# Hablaqui Mobile App Source Code

This directory contains the main source code for the Hablaqui mobile application. The codebase is organized following clean architecture principles and feature-first organization.

## Directory Structure

```
lib/
├── config/                 # App configuration and constants
│   ├── app_config.dart    # App-wide configuration
│   ├── routes.dart        # Route definitions
│   ├── theme.dart         # App theme configuration
│   └── constants.dart     # App-wide constants
│
├── core/                  # Core functionality
│   ├── error/            # Error handling
│   ├── network/          # Network utilities
│   ├── storage/          # Local storage
│   └── utils/            # Utility functions
│
├── data/                 # Data layer
│   ├── datasources/      # Data sources (local and remote)
│   ├── models/           # Data models
│   └── repositories/     # Repository implementations
│
├── domain/              # Domain layer
│   ├── entities/        # Business entities
│   ├── repositories/    # Repository interfaces
│   └── usecases/        # Use cases
│
├── presentation/        # Presentation layer
│   ├── blocs/          # State management
│   ├── pages/          # Screen implementations
│   └── widgets/        # Reusable widgets
│
└── main.dart           # Application entry point
```

## Architecture

The application follows Clean Architecture principles with the following layers:

### Presentation Layer
- Contains UI components (pages, widgets)
- Implements BLoC pattern for state management
- Handles user interactions
- Manages UI state

### Domain Layer
- Contains business logic
- Defines entities and repository interfaces
- Implements use cases
- Independent of data sources

### Data Layer
- Implements repository interfaces
- Handles data sources (local and remote)
- Manages data models
- Handles data transformation

### Core Layer
- Contains shared functionality
- Implements utilities and helpers
- Manages configuration
- Handles error cases

## Key Components

### State Management
- Uses BLoC pattern for state management
- Implements event-driven architecture
- Handles state transitions
- Manages side effects

### Navigation
- Implements named routes
- Handles deep linking
- Manages navigation state
- Provides navigation utilities

### Network
- Implements HTTP client
- Handles API communication
- Manages authentication
- Implements retry logic

### Storage
- Implements local storage
- Manages secure storage
- Handles caching
- Implements data persistence

### Error Handling
- Implements error boundaries
- Manages error states
- Provides error reporting
- Handles recovery

## Best Practices

1. **Code Organization**
   - Follow feature-first organization
   - Keep related code together
   - Use meaningful names
   - Maintain consistent structure

2. **State Management**
   - Use BLoC for complex state
   - Keep state immutable
   - Handle side effects properly
   - Implement proper error handling

3. **Testing**
   - Write unit tests for business logic
   - Implement widget tests for UI
   - Use integration tests for flows
   - Maintain good test coverage

4. **Performance**
   - Implement proper caching
   - Use lazy loading
   - Optimize rebuilds
   - Monitor memory usage

5. **Security**
   - Implement proper authentication
   - Secure sensitive data
   - Validate inputs
   - Handle errors gracefully

## Development Guidelines

1. **Code Style**
   - Follow Dart style guide
   - Use meaningful names
   - Add proper documentation
   - Keep functions small

2. **Documentation**
   - Document public APIs
   - Add inline comments
   - Keep README updated
   - Document complex logic

3. **Testing**
   - Write tests for new features
   - Maintain test coverage
   - Test edge cases
   - Use proper test doubles

4. **Review Process**
   - Follow code review guidelines
   - Address review comments
   - Keep PRs focused
   - Update documentation

## Getting Started

1. Set up the development environment
2. Install dependencies
3. Configure environment variables
4. Run the application

See the main README.md for detailed setup instructions. 