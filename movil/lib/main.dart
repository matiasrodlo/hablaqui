import 'package:flutter/material.dart';
import 'colors.dart' as appColors;
import 'routes.dart' as routes;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget 
{
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) 
  {
	  String initialRoute = '/';
	  
    return MaterialApp(
      title: 'Hablaqui',
      theme: ThemeData(
        primarySwatch: appColors.primaryColor,
      ),
		debugShowCheckedModeBanner: false,
		routes: routes.appRoutes,
		initialRoute: initialRoute,
    );
  }
}
