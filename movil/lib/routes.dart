import 'package:flutter/material.dart';
import 'pages/home.dart';
import 'pages/welcome.dart';
import 'pages/users/login.dart';
import 'pages/users/register.dart';
import 'pages/psychologists/search.dart';


final appRoutes = <String, WidgetBuilder>{
	'/': (BuildContext context) => Welcome(), 
	'/home': (BuildContext context) => Home(), 
	'/login': (BuildContext context) => Login(), 
	'/register': (BuildContext context) => Register(),
	'/psychologists/search': (BuildContext context) => SearchPsychologists(),
};
