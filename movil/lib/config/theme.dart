/// Application Theme Configuration
/// 
/// This file contains the theme configuration for the Hablaqui mobile application.
/// It defines colors, typography, and other visual elements for both light and dark themes.

import 'package:flutter/material.dart';

/// Application theme configuration.
/// 
/// This class:
/// - Defines color schemes
/// - Sets up typography
/// - Configures component themes
/// - Manages theme modes
class AppTheme {
  /// Private constructor to prevent instantiation
  AppTheme._();

  /// Primary color for the application
  static const Color primaryColor = Color(0xFF2196F3);

  /// Secondary color for the application
  static const Color secondaryColor = Color(0xFF03A9F4);

  /// Accent color for the application
  static const Color accentColor = Color(0xFF00BCD4);

  /// Error color for the application
  static const Color errorColor = Color(0xFFE53935);

  /// Success color for the application
  static const Color successColor = Color(0xFF43A047);

  /// Warning color for the application
  static const Color warningColor = Color(0xFFFFA000);

  /// Light theme configuration
  static ThemeData get lightTheme {
    return ThemeData(
      // Color scheme
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        error: errorColor,
      ),

      // Typography
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
        headline3: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.black87,
        ),
        bodyText1: TextStyle(
          fontSize: 16,
          color: Colors.black87,
        ),
        bodyText2: TextStyle(
          fontSize: 14,
          color: Colors.black54,
        ),
      ),

      // Component themes
      appBarTheme: const AppBarTheme(
        backgroundColor: primaryColor,
        elevation: 0,
        centerTitle: true,
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        buttonColor: primaryColor,
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
        fillColor: Colors.grey[100],
      ),

      // Other theme properties
      scaffoldBackgroundColor: Colors.white,
      brightness: Brightness.light,
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
  }

  /// Dark theme configuration
  static ThemeData get darkTheme {
    return ThemeData(
      // Color scheme
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        error: errorColor,
      ),

      // Typography
      textTheme: const TextTheme(
        headline1: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        headline2: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        headline3: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        bodyText1: TextStyle(
          fontSize: 16,
          color: Colors.white,
        ),
        bodyText2: TextStyle(
          fontSize: 14,
          color: Colors.white70,
        ),
      ),

      // Component themes
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.black87,
        elevation: 0,
        centerTitle: true,
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        buttonColor: primaryColor,
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        color: Colors.grey[900],
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
        fillColor: Colors.grey[800],
      ),

      // Other theme properties
      scaffoldBackgroundColor: Colors.black,
      brightness: Brightness.dark,
      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
  }

  /// Get text style for a specific type
  /// 
  /// [type] The type of text style to get
  /// Returns the corresponding text style
  static TextStyle getTextStyle(TextType type) {
    switch (type) {
      case TextType.headline1:
        return const TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
        );
      case TextType.headline2:
        return const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
        );
      case TextType.headline3:
        return const TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
        );
      case TextType.body1:
        return const TextStyle(
          fontSize: 16,
        );
      case TextType.body2:
        return const TextStyle(
          fontSize: 14,
        );
      default:
        return const TextStyle();
    }
  }

  /// Get color for a specific type
  /// 
  /// [type] The type of color to get
  /// Returns the corresponding color
  static Color getColor(ColorType type) {
    switch (type) {
      case ColorType.primary:
        return primaryColor;
      case ColorType.secondary:
        return secondaryColor;
      case ColorType.accent:
        return accentColor;
      case ColorType.error:
        return errorColor;
      case ColorType.success:
        return successColor;
      case ColorType.warning:
        return warningColor;
      default:
        return Colors.black;
    }
  }
}

/// Text style types
enum TextType {
  headline1,
  headline2,
  headline3,
  body1,
  body2,
}

/// Color types
enum ColorType {
  primary,
  secondary,
  accent,
  error,
  success,
  warning,
} 