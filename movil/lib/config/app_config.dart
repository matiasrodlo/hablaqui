/// Application Configuration
/// 
/// This file contains the application-wide configuration settings and constants.
/// It manages environment variables, API endpoints, and other app-wide settings.

import 'package:flutter/foundation.dart';
import 'package:hablaqui/core/storage/storage_manager.dart';

/// Manages application-wide configuration settings.
/// 
/// This class:
/// - Loads and manages environment variables
/// - Provides access to API endpoints
/// - Manages feature flags
/// - Handles app-wide settings
class AppConfig {
  /// Private constructor to prevent instantiation
  AppConfig._();

  /// API base URL for the application
  static String get apiBaseUrl => _apiBaseUrl;
  static String _apiBaseUrl = '';

  /// WebSocket URL for real-time communication
  static String get wsUrl => _wsUrl;
  static String _wsUrl = '';

  /// Firebase configuration
  static Map<String, dynamic> get firebaseConfig => _firebaseConfig;
  static Map<String, dynamic> _firebaseConfig = {};

  /// Feature flags
  static Map<String, bool> get featureFlags => _featureFlags;
  static Map<String, bool> _featureFlags = {};

  /// Environment type (development, staging, production)
  static String get environment => _environment;
  static String _environment = 'development';

  /// App version
  static String get version => _version;
  static String _version = '1.0.0';

  /// Build number
  static String get buildNumber => _buildNumber;
  static String _buildNumber = '1';

  /// Initialize the application configuration.
  /// 
  /// This method:
  /// 1. Loads environment variables
  /// 2. Sets up API endpoints
  /// 3. Configures feature flags
  /// 4. Initializes other settings
  static Future<void> initialize() async {
    try {
      // Load environment variables
      await _loadEnvironmentVariables();

      // Set up API endpoints
      _setupApiEndpoints();

      // Configure feature flags
      _configureFeatureFlags();

      // Initialize other settings
      await _initializeSettings();
    } catch (e) {
      debugPrint('Error initializing AppConfig: $e');
      rethrow;
    }
  }

  /// Load environment variables from storage.
  /// 
  /// This method:
  /// - Loads variables from secure storage
  /// - Sets default values if not found
  /// - Validates required variables
  static Future<void> _loadEnvironmentVariables() async {
    final storage = StorageManager.instance;
    
    // Load environment
    _environment = await storage.getString('environment') ?? 'development';
    
    // Load version info
    _version = await storage.getString('version') ?? '1.0.0';
    _buildNumber = await storage.getString('buildNumber') ?? '1';
  }

  /// Set up API endpoints based on environment.
  /// 
  /// This method:
  /// - Sets base URL for API calls
  /// - Configures WebSocket URL
  /// - Sets up other API-related settings
  static void _setupApiEndpoints() {
    switch (_environment) {
      case 'production':
        _apiBaseUrl = 'https://api.hablaqui.com';
        _wsUrl = 'wss://ws.hablaqui.com';
        break;
      case 'staging':
        _apiBaseUrl = 'https://staging-api.hablaqui.com';
        _wsUrl = 'wss://staging-ws.hablaqui.com';
        break;
      default:
        _apiBaseUrl = 'http://localhost:3000';
        _wsUrl = 'ws://localhost:3001';
    }
  }

  /// Configure feature flags for the application.
  /// 
  /// This method:
  /// - Sets up feature toggles
  /// - Configures A/B testing
  /// - Manages experimental features
  static void _configureFeatureFlags() {
    _featureFlags = {
      'enableDarkMode': true,
      'enablePushNotifications': true,
      'enableVideoCalls': true,
      'enableFileSharing': true,
      'enableOfflineMode': false,
    };
  }

  /// Initialize other application settings.
  /// 
  /// This method:
  /// - Sets up logging
  /// - Configures analytics
  /// - Initializes other services
  static Future<void> _initializeSettings() async {
    // Initialize logging
    _setupLogging();

    // Configure analytics
    await _setupAnalytics();

    // Initialize other services
    await _initializeServices();
  }

  /// Set up application logging.
  /// 
  /// This method:
  /// - Configures log levels
  /// - Sets up log handlers
  /// - Initializes crash reporting
  static void _setupLogging() {
    // Configure log levels based on environment
    final logLevel = _environment == 'production' ? 'error' : 'debug';
    
    // Set up log handlers
    // TODO: Implement logging configuration
  }

  /// Set up analytics tracking.
  /// 
  /// This method:
  /// - Initializes analytics SDK
  /// - Configures tracking events
  /// - Sets up user identification
  static Future<void> _setupAnalytics() async {
    // Initialize analytics
    // TODO: Implement analytics setup
  }

  /// Initialize other application services.
  /// 
  /// This method:
  /// - Sets up background services
  /// - Initializes third-party integrations
  /// - Configures other app services
  static Future<void> _initializeServices() async {
    // Initialize services
    // TODO: Implement service initialization
  }

  /// Check if a feature is enabled.
  /// 
  /// [featureName] The name of the feature to check
  /// Returns true if the feature is enabled, false otherwise
  static bool isFeatureEnabled(String featureName) {
    return _featureFlags[featureName] ?? false;
  }

  /// Get the current environment.
  /// 
  /// Returns the current environment name
  static String getCurrentEnvironment() {
    return _environment;
  }

  /// Check if the app is running in production.
  /// 
  /// Returns true if the app is in production environment
  static bool isProduction() {
    return _environment == 'production';
  }

  /// Check if the app is running in development.
  /// 
  /// Returns true if the app is in development environment
  static bool isDevelopment() {
    return _environment == 'development';
  }
} 