/// Hablaqui Mobile Application
/// 
/// This is the main entry point for the Hablaqui mobile application.
/// It initializes the app, sets up dependencies, and configures the environment.

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hablaqui/config/app_config.dart';
import 'package:hablaqui/config/routes.dart';
import 'package:hablaqui/config/theme.dart';
import 'package:hablaqui/core/error/error_handler.dart';
import 'package:hablaqui/core/network/network_info.dart';
import 'package:hablaqui/core/storage/storage_manager.dart';
import 'package:hablaqui/presentation/blocs/app_bloc.dart';

/// The main function that initializes the application.
/// 
/// This function:
/// 1. Ensures Flutter bindings are initialized
/// 2. Sets up error handling
/// 3. Initializes core services
/// 4. Runs the application
void main() async {
	// Ensure Flutter is initialized
	WidgetsFlutterBinding.ensureInitialized();

	// Initialize error handling
	ErrorHandler.initialize();

	// Initialize core services
	await _initializeServices();

	// Run the application
	runApp(const HablaquiApp());
}

/// Initializes core services required by the application.
/// 
/// This includes:
/// - Network information service
/// - Storage manager
/// - App configuration
Future<void> _initializeServices() async {
	// Initialize network info
	await NetworkInfo.initialize();

	// Initialize storage
	await StorageManager.initialize();

	// Load app configuration
	await AppConfig.initialize();
}

/// The root widget of the application.
/// 
/// This widget:
/// - Sets up the app theme
/// - Configures routing
/// - Provides global state management
/// - Handles error boundaries
class HablaquiApp extends StatelessWidget {
	const HablaquiApp({Key? key}) : super(key: key);

	@override
	Widget build(BuildContext context) {
		return MultiBlocProvider(
			providers: [
				// Add global BLoC providers here
				BlocProvider(create: (context) => AppBloc()),
			],
			child: MaterialApp(
				title: 'Hablaqui',
				theme: AppTheme.lightTheme,
				darkTheme: AppTheme.darkTheme,
				themeMode: ThemeMode.system,
				onGenerateRoute: AppRouter.onGenerateRoute,
				builder: (context, child) {
					// Add error boundary
					return ErrorBoundary(
						child: child!,
					);
				},
			),
		);
	}
}

/// A widget that catches and handles errors in the widget tree.
/// 
/// This widget:
/// - Catches errors in the widget tree
/// - Displays error UI
/// - Logs errors for debugging
class ErrorBoundary extends StatelessWidget {
	final Widget child;

	const ErrorBoundary({
		Key? key,
		required this.child,
	}) : super(key: key);

	@override
	Widget build(BuildContext context) {
		return ErrorWidget.builder = (FlutterErrorDetails details) {
			// Log the error
			ErrorHandler.logError(details.exception, details.stack);

			// Return error UI
			return Material(
				child: Container(
					color: Colors.white,
					child: Center(
						child: Column(
							mainAxisAlignment: MainAxisAlignment.center,
							children: [
								const Icon(
									Icons.error_outline,
									color: Colors.red,
									size: 60,
								),
								const SizedBox(height: 16),
								Text(
									'Something went wrong',
									style: Theme.of(context).textTheme.headline6,
								),
								const SizedBox(height: 8),
								Text(
									'Please try again later',
									style: Theme.of(context).textTheme.bodyText2,
								),
							],
						),
					),
				),
			);
		};
	}
}
