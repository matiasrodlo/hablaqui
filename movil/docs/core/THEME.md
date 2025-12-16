# Theme System

## Overview
The `AppTheme` class manages the application's visual appearance, providing consistent styling across the app. It supports both light and dark themes, with customizable colors, typography, and component styles.

## Key Features
- Light and dark theme support
- Custom color palette
- Typography system
- Component themes
- Responsive design
- Accessibility support

## Color System

### Primary Colors
```dart
static const Color primaryColor = Color(0xFF2196F3);
static const Color secondaryColor = Color(0xFF03A9F4);
static const Color accentColor = Color(0xFF00BCD4);
```

### Semantic Colors
```dart
static const Color errorColor = Color(0xFFE53935);
static const Color successColor = Color(0xFF43A047);
static const Color warningColor = Color(0xFFFFA000);
```

## Theme Configuration

### Light Theme
```dart
static ThemeData get lightTheme {
  return ThemeData(
    primaryColor: primaryColor,
    colorScheme: const ColorScheme.light(
      primary: primaryColor,
      secondary: secondaryColor,
      error: errorColor,
    ),
    // ... other configurations
  );
}
```

### Dark Theme
```dart
static ThemeData get darkTheme {
  return ThemeData(
    primaryColor: primaryColor,
    colorScheme: const ColorScheme.dark(
      primary: primaryColor,
      secondary: secondaryColor,
      error: errorColor,
    ),
    // ... other configurations
  );
}
```

## Typography

### Text Styles
```dart
textTheme: const TextTheme(
  headline1: TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
  ),
  headline2: TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
  ),
  // ... other styles
)
```

### Text Types
```dart
enum TextType {
  headline1,
  headline2,
  headline3,
  body1,
  body2,
}
```

## Component Themes

### AppBar
```dart
appBarTheme: const AppBarTheme(
  backgroundColor: primaryColor,
  elevation: 0,
  centerTitle: true,
)
```

### Buttons
```dart
buttonTheme: ButtonThemeData(
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(8),
  ),
  buttonColor: primaryColor,
)
```

### Cards
```dart
cardTheme: CardTheme(
  elevation: 2,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
)
```

### Input Fields
```dart
inputDecorationTheme: InputDecorationTheme(
  border: OutlineInputBorder(
    borderRadius: BorderRadius.circular(8),
  ),
  filled: true,
  fillColor: Colors.grey[100],
)
```

## Usage

### Applying Theme
```dart
MaterialApp(
  theme: AppTheme.lightTheme,
  darkTheme: AppTheme.darkTheme,
  themeMode: ThemeMode.system,
)
```

### Accessing Theme
```dart
// In a widget
final theme = Theme.of(context);
final primaryColor = theme.primaryColor;
```

### Getting Text Style
```dart
final textStyle = AppTheme.getTextStyle(TextType.headline1);
```

### Getting Color
```dart
final color = AppTheme.getColor(ColorType.primary);
```

## Best Practices

1. **Theme Consistency**
   - Use theme colors consistently
   - Follow the design system
   - Maintain visual hierarchy

2. **Responsive Design**
   - Use relative sizes
   - Consider different screen sizes
   - Test on multiple devices

3. **Accessibility**
   - Ensure sufficient contrast
   - Support text scaling
   - Consider color blindness

4. **Performance**
   - Cache theme data
   - Minimize theme changes
   - Optimize theme assets

## Customization

### Extending Theme
```dart
ThemeData(
  extensions: [
    CustomThemeExtension(
      customColor: Colors.blue,
    ),
  ],
)
```

### Custom Theme Data
```dart
class CustomThemeExtension extends ThemeExtension<CustomThemeExtension> {
  final Color customColor;

  CustomThemeExtension({required this.customColor});

  @override
  ThemeExtension<CustomThemeExtension> copyWith({
    Color? customColor,
  }) {
    return CustomThemeExtension(
      customColor: customColor ?? this.customColor,
    );
  }

  @override
  ThemeExtension<CustomThemeExtension> lerp(
    ThemeExtension<CustomThemeExtension>? other,
    double t,
  ) {
    if (other is! CustomThemeExtension) {
      return this;
    }
    return CustomThemeExtension(
      customColor: Color.lerp(customColor, other.customColor, t)!,
    );
  }
}
```

## Testing

### Theme Tests
```dart
void main() {
  testWidgets('should apply light theme', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.lightTheme,
        home: const MyWidget(),
      ),
    );
    expect(Theme.of(tester.element(find.byType(MyWidget))).brightness,
        equals(Brightness.light));
  });
}
```

## Maintenance

### Adding New Colors
1. Add color constant
2. Update color scheme
3. Document usage
4. Update tests

### Adding New Text Styles
1. Add text style
2. Update text theme
3. Document usage
4. Update tests

### Updating Component Themes
1. Update theme configuration
2. Test on different devices
3. Update documentation
4. Run tests

## Troubleshooting

### Common Issues
1. **Theme Not Applying**
   - Check theme provider
   - Verify theme mode
   - Check widget tree

2. **Inconsistent Styling**
   - Verify theme inheritance
   - Check style overrides
   - Validate theme data

3. **Performance Issues**
   - Check theme rebuilds
   - Verify asset loading
   - Monitor memory usage

## Related Documentation
- [App Configuration](APP_CONFIG.md)
- [Component Library](../components/README.md)
- [Design System](../design/README.md) 