# Widget Library

## Overview
// This document provides detailed information about the reusable widgets used in the Hablaquí mobile application.

## Common Widgets

### CustomAppBar
// A custom app bar widget with dynamic styling and actions.

#### Properties
```dart
class CustomAppBar extends StatelessWidget {
  final String title; // The title to display in the app bar
  final bool showBackButton; // Whether to show the back button
  final List<Widget> actions; // Additional action buttons
  final Color backgroundColor; // Background color of the app bar
  final Color textColor;
  final VoidCallback? onBackPressed; // Callback when back button is pressed
}
```

#### Usage
```dart
CustomAppBar(
  title: 'Home', // Main title
  showBackButton: true, // Enable back button
  backgroundColor: Colors.blue, // Set background color
  textColor: Colors.white,
  onBackPressed: () {
    Navigator.pop(context); // Handle back navigation
  },
  actions: [
    IconButton(
      icon: Icon(Icons.notifications), // Notification icon
      onPressed: () {}, // Handle notification tap
    ),
  ],
)
```

### ProfileAvatar
// A circular avatar widget for user and specialist profiles.

#### Properties
```dart
class ProfileAvatar extends StatelessWidget {
  final String imageUrl; // URL of the profile image
  final String? fallbackImage; // Fallback image URL
  final double size; // Size of the avatar
  final VoidCallback? onTap; // Callback when avatar is tapped
  final bool showBorder;
  final Color borderColor;
}
```

#### Usage
```dart
ProfileAvatar(
  imageUrl: 'https://example.com/avatar.jpg', // Profile image
  size: 50.0, // Avatar size
  fallbackImage: 'assets/default_avatar.png', // Default image
  onTap: () {
    // Handle avatar tap
  },
  showBorder: true,
  borderColor: Colors.blue,
)
```

### AppointmentCard
// A card widget displaying appointment information.

#### Properties
```dart
class AppointmentCard extends StatelessWidget {
  final Appointment appointment;
  final VoidCallback? onTap;
  final VoidCallback? onCancel;
  final VoidCallback? onReschedule;
  final bool showActions;
}
```

#### Usage
```dart
AppointmentCard(
  appointment: appointment,
  showActions: true,
  onTap: () => _showAppointmentDetails(context),
  onCancel: () => _cancelAppointment(context),
  onReschedule: () => _rescheduleAppointment(context),
)
```

## Feature Widgets

### ChatBubble
// A chat message bubble widget.

#### Properties
```dart
class ChatBubble extends StatelessWidget {
  final Message message;
  final bool isMe;
  final VoidCallback? onLongPress;
  final VoidCallback? onTap;
}
```

#### Usage
```dart
ChatBubble(
  message: message,
  isMe: message.senderId == currentUserId,
  onLongPress: () => _showMessageOptions(context),
  onTap: () => _showMessageDetails(context),
)
```

### SpecialistCard
// A card widget displaying specialist information.

#### Properties
```dart
class SpecialistCard extends StatelessWidget {
  final Specialist specialist;
  final VoidCallback? onTap;
  final VoidCallback? onBook;
  final bool showAvailability;
  final bool showRating;
}
```

#### Usage
```dart
SpecialistCard(
  specialist: specialist,
  showAvailability: true,
  showRating: true,
  onTap: () => _showSpecialistProfile(context),
  onBook: () => _bookAppointment(context),
)
```

## State Management

### Provider Integration
// Widgets use Provider for state management.

#### Example
```dart
class AppointmentList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<AppointmentProvider>(
      builder: (context, provider, child) {
        return ListView.builder(
          itemCount: provider.appointments.length,
          itemBuilder: (context, index) {
            return AppointmentCard(
              appointment: provider.appointments[index],
            );
          },
        );
      },
    );
  }
}
```

## Styling

### Theme
// Widgets use the application's theme for consistent styling.

#### Theme Data
```dart
final theme = ThemeData(
  primaryColor: Color(0xFF2196F3),
  accentColor: Color(0xFFFFC107),
  fontFamily: 'Roboto',
  textTheme: TextTheme(
    headline1: TextStyle(
      fontSize: 24.0,
      fontWeight: FontWeight.bold,
    ),
    bodyText1: TextStyle(
      fontSize: 16.0,
    ),
  ),
);
```

### Responsive Design
// Widgets adapt to different screen sizes.

#### Example
```dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth < 600) {
      return MobileLayout();
    } else {
      return TabletLayout();
    }
  },
)
```

## Accessibility

### Semantics
// Widgets include proper semantics for screen readers.

#### Example
```dart
Semantics(
  label: 'Appointment card',
  hint: 'Double tap to view details',
  child: AppointmentCard(
    appointment: appointment,
  ),
)
```

### Dynamic Text
// Widgets support dynamic text sizes.

#### Example
```dart
Text(
  'Appointment',
  style: Theme.of(context).textTheme.bodyText1?.copyWith(
    fontSize: 16.0 * MediaQuery.of(context).textScaleFactor,
  ),
)
```

## Testing

### Widget Tests
// Widgets include unit tests for functionality.

#### Example
```dart
void main() {
  testWidgets('AppointmentCard displays correctly', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: AppointmentCard(
          appointment: testAppointment,
        ),
      ),
    );
    
    expect(find.text(testAppointment.title), findsOneWidget);
    expect(find.text(testAppointment.date), findsOneWidget);
  });
}
```

### Integration Tests
// Widgets are tested in integration with other widgets.

#### Example
```dart
void main() {
  integrationTestWidgets('Appointment flow test',
      (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    await tester.tap(find.byType(SpecialistCard));
    await tester.pumpAndSettle();
    expect(find.byType(AppointmentForm), findsOneWidget);
  });
}
```

## Performance

### Optimization
// Widgets are optimized for performance using:
- const constructors // Compile-time constants
- RepaintBoundary // Optimize repaints
- ListView.builder // Efficient list rendering
- CachedNetworkImage // Optimize image loading

### Best Practices
// Widget development guidelines
- Keep widgets small and focused // Single responsibility
- Use const where possible // Performance optimization
- Implement proper error boundaries // Error management
- Optimize rebuilds // Performance improvement

## Platform-Specific Features

### Android
// Android-specific widget features
- Material Design components // Android UI components
- Back button handling
- Deep linking support
- Push notifications

### iOS
// iOS-specific widget features
- Cupertino components // iOS UI components
- Gesture handling
- Face ID/Touch ID integration
- Push notifications

## Support
// Support information
For widget support, please contact the development team or create an issue in the repository. 